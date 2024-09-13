<?php
/*
Plugin Name: Ranking Mpesa WooCommerce Gateway
Description: Custom Mpesa payment gateway for WooCommerce.
Version: 1.7
Author: Ranking Software & Tech
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
            
            $this->init_form_fields();
            $this->init_settings();
            
            $this->title = $this->get_option('title');
            $this->description = $this->get_option('description');
            $this->consumer_key = $this->get_option('consumer_key');
            $this->consumer_secret = $this->get_option('consumer_secret');
            $this->shortcode = $this->get_option('shortcode');
            $this->passkey = $this->get_option('passkey');
            $this->sandbox = $this->get_option('sandbox') === 'yes';
            $this->callback_url = $this->get_option('callback_url');

            add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));

            // Handle Mpesa callback
            add_action('wp_ajax_mpesa_handle_callback', array($this, 'mpesa_handle_callback'));
            add_action('wp_ajax_nopriv_mpesa_handle_callback', array($this, 'mpesa_handle_callback'));
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
                'callback_url' => array(
                    'title' => 'Callback URL',
                    'type' => 'text',
                    'description' => 'Enter the URL where Mpesa will send payment notifications.',
                    'default' => 'https://yourwebsite.com/wp-admin/admin-ajax.php?action=mpesa_handle_callback'
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
                // Payment request was successful
                return array(
                    'result' => 'success',
                    'redirect' => $this->get_return_url($order),
                );
            } else {
                // Log the error for debugging
                wc_add_notice('Payment error: ' . $result->ResponseDescription, 'error');
                return;
            }
        }

        public function mpesa_payment_request($amount, $phone_number) {
            $token = $this->get_mpesa_access_token();
            $timestamp = date("YmdHis");
            $password = base64_encode($this->shortcode . $this->passkey . $timestamp);

            $data = array(
                'BusinessShortCode' => $this->shortcode,
                'Password' => $password,
                'Timestamp' => $timestamp,
                'TransactionType' => 'CustomerPayBillOnline',
                'Amount' => $amount,
                'PartyA' => $phone_number,
                'PartyB' => $this->shortcode,
                'PhoneNumber' => $phone_number,
                'CallBackURL' => $this->callback_url,
                'AccountReference' => 'WooCommerce Order',
                'TransactionDesc' => 'Payment for order'
            );

            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $this->sandbox ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest' : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest');
            curl_setopt($curl, CURLOPT_HTTPHEADER, array('Authorization: Bearer ' . $token, 'Content-Type: application/json'));
            curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($curl);
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

            $result = json_decode($response);
            return isset($result->access_token) ? $result->access_token : null;
        }

        public function mpesa_handle_callback() {
            // Retrieve callback response
            $response = json_decode(file_get_contents('php://input'), true);

            if (isset($response['Body']['stkCallback']['ResultCode']) && $response['Body']['stkCallback']['ResultCode'] == 0) {
                // Payment was successful
                $transaction_id = $response['Body']['stkCallback']['CallbackMetadata']['Item'][1]['Value'];
                $amount = $response['Body']['stkCallback']['CallbackMetadata']['Item'][0]['Value'];
                $phone_number = $response['Body']['stkCallback']['CallbackMetadata']['Item'][4]['Value'];

                // Find the WooCommerce order by phone number or any other identifier
                $order_id = 123; // You should map this to your order
                $order = wc_get_order($order_id);
                $order->payment_complete($transaction_id);
                $order->add_order_note('Mpesa payment received: ' . $amount);
            } else {
                // Handle payment failure
                error_log('Mpesa payment failed: ' . print_r($response, true));
            }
        }
    }
}
