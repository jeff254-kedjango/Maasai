<?php
/*
Plugin Name: Ranking Mpesa WooCommerce Gateway
Description: Custom Mpesa payment gateway for WooCommerce.
Version: 1.1
Author: Kwemange Nyagrowa
*/

add_filter('woocommerce_payment_gateways', 'mpesa_add_gateway_class');
function mpesa_add_gateway_class($gateways) {
    $gateways[] = 'WC_Mpesa_Gateway'; 
    return $gateways;
}

add_action('plugins_loaded', 'mpesa_init_gateway_class');
function mpesa_init_gateway_class() {
    class WC_Mpesa_Gateway extends WC_Payment_Gateway {
        
        public function __construct() {
            $this->id = 'mpesa'; 
            $this->icon = ''; 
            $this->has_fields = true; 
            $this->method_title = 'Mpesa Gateway';
            $this->method_description = 'Mpesa Payment Gateway for WooCommerce';

            // Load settings
            $this->init_form_fields();
            $this->init_settings();

            $this->title = $this->get_option('title');
            $this->description = $this->get_option('description');
            $this->consumer_key = getenv('MPESA_CONSUMER_KEY') ?: $this->get_option('consumer_key');
            $this->consumer_secret = getenv('MPESA_CONSUMER_SECRET') ?: $this->get_option('consumer_secret');
            $this->shortcode = getenv('MPESA_SHORTCODE') ?: $this->get_option('shortcode');
            $this->passkey = getenv('MPESA_PASSKEY') ?: $this->get_option('passkey');
            $this->sandbox = 'yes' === $this->get_option('sandbox');
            
            add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));
        }

        public function init_form_fields() {
            $this->form_fields = array(
                'enabled' => array(
                    'title' => 'Enable/Disable',
                    'type' => 'checkbox',
                    'label' => 'Enable Mpesa Payment Gateway',
                    'default' => 'yes'
                ),
                'title' => array(
                    'title' => 'Title',
                    'type' => 'text',
                    'default' => 'Mpesa'
                ),
                'description' => array(
                    'title' => 'Description',
                    'type' => 'text',
                    'default' => 'Pay using Mpesa'
                ),
                'consumer_key' => array(
                    'title' => 'Consumer Key',
                    'type' => 'text',
                ),
                'consumer_secret' => array(
                    'title' => 'Consumer Secret',
                    'type' => 'text',
                ),
                'shortcode' => array(
                    'title' => 'Mpesa Shortcode',
                    'type' => 'text',
                ),
                'passkey' => array(
                    'title' => 'Mpesa Passkey',
                    'type' => 'text',
                ),
                'sandbox' => array(
                    'title' => 'Sandbox Mode',
                    'type' => 'checkbox',
                    'label' => 'Enable Sandbox Mode',
                    'default' => 'yes',
                ),
            );
        }
        
        public function process_payment($order_id) {
            global $woocommerce;
            $order = wc_get_order($order_id);

            // Validate phone number
            $phone_number = sanitize_text_field($order->get_billing_phone());

            // Process payment via Mpesa
            $result = $this->mpesa_payment_request($order->get_total(), $phone_number);

            if (isset($result->ResponseCode) && $result->ResponseCode == "0") {
                // Payment successful
                $order->payment_complete();
                $order->reduce_order_stock();
                $woocommerce->cart->empty_cart();

                return array(
                    'result' => 'success',
                    'redirect' => $this->get_return_url($order),
                );
            } else {
                // Log the error for debugging
                $this->log_error('Mpesa payment error: ' . $result->ResponseDescription);
                wc_add_notice('Payment error: ' . $result->ResponseDescription, 'error');
                return;
            }
        }

        public function mpesa_payment_request($amount, $phone_number) {
            // Authentication
            $token = $this->get_mpesa_access_token();

            // Payment request via STK Push
            $timestamp = date("YmdHis");
            $password = base64_encode($this->shortcode . $this->passkey . $timestamp);

            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $this->sandbox ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest' : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest');
            curl_setopt($curl, CURLOPT_HTTPHEADER, array('Authorization: Bearer ' . $token, 'Content-Type: application/json'));

            $data = array(
                'BusinessShortCode' => $this->shortcode,
                'Password' => $password,
                'Timestamp' => $timestamp,
                'TransactionType' => 'CustomerPayBillOnline',
                'Amount' => $amount,
                'PartyA' => $phone_number,
                'PartyB' => $this->shortcode,
                'PhoneNumber' => $phone_number,
                'CallBackURL' => 'https://yourwebsite.com/callback',
                'AccountReference' => 'Order ' . rand(),
                'TransactionDesc' => 'WooCommerce Order Payment'
            );

            curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($curl);

            // Check for curl errors
            if(curl_errno($curl)) {
                $this->log_error('Mpesa Curl Error: ' . curl_error($curl));
                wc_add_notice('Payment error: ' . curl_error($curl), 'error');
            }
            
            curl_close($curl);

            return json_decode($response);
        }

        private function get_mpesa_access_token() {
            $url = $this->sandbox ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials' : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

            $credentials = base64_encode($this->consumer_key . ':' . $this->consumer_secret);
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $url);
            curl_setopt($curl, CURLOPT_HTTPHEADER, array('Authorization: Basic ' . $credentials));
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($curl);
            curl_close($curl);

            $json = json_decode($response);
            if (isset($json->access_token)) {
                return $json->access_token;
            } else {
                $this->log_error('Mpesa Access Token Error: ' . $json->errorMessage);
                wc_add_notice('Payment error: Unable to authenticate Mpesa.', 'error');
            }
            return null;
        }

        private function log_error($message) {
            if (class_exists('WC_Logger')) {
                $logger = new WC_Logger();
                $logger->add('mpesa', $message);
            }
        }
    }
}
