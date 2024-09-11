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
            $this->callback_url = $this->get_option('callback_url');
            $this->sandbox_url = $this->get_option('sandbox_url');

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
                    'description' => 'Enter the Callback URL where Mpesa will send the payment notification. It should be in the format: https://yourdomain.com/wp-admin/admin-ajax.php?action=mpesa_handle_callback. Replace "yourdomain.com" with your actual domain name.',
                    'default' => 'https://yourwebsite.com/wp-admin/admin-ajax.php?action=mpesa_handle_callback'
                ),
                'sandbox_url' => array(
                    'title' => 'Sandbox URL',
                    'type' => 'text',
                    'description' => 'Sandbox URL for STK Push requests in the testing environment.',
                    'default' => 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
                ),
                'sandbox_oauth_url' => array(
                    'title' => 'Sandbox OAuth URL',
                    'type' => 'text',
                    'description' => 'Sandbox URL for OAuth token generation in the testing environment.',
                    'default' => 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
                ),
                'production_oauth_url' => array(
                    'title' => 'Production OAuth URL',
                    'type' => 'text',
                    'description' => 'Production URL for OAuth token generation in the live environment.',
                    'default' => 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
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
            curl_setopt($curl, CURLOPT_URL, $this->sandbox ? $this->sandbox_url : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest');
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
                'CallBackURL' => $this->callback_url,
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
            // Get URLs from settings
            $sandbox_oauth_url = $this->get_option('sandbox_oauth_url') ?: 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
            $production_oauth_url = $this->get_option('production_oauth_url') ?: 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
        
            // Use sandbox URL if sandbox mode is enabled, otherwise use production
            $url = $this->sandbox ? $sandbox_oauth_url : $production_oauth_url;
        
            // Authentication
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

        public function mpesa_handle_callback() {
            // Get POST data
            $body = json_decode(file_get_contents('php://input'));

            if (isset($body->Body->stkCallback->ResultCode) && $body->Body->stkCallback->ResultCode == 0) {
                // Payment was successful
                $checkout_request_id = sanitize_text_field($body->Body->stkCallback->CheckoutRequestID);
                $amount = sanitize_text_field($body->Body->stkCallback->CallbackMetadata->Item[0]->Value);
                $phone_number = sanitize_text_field($body->Body->stkCallback->CallbackMetadata->Item[4]->Value);

                // You may need to process this information to update the order status
                // Example: Update WooCommerce order status based on $checkout_request_id

                wp_send_json_success('Payment successful');
            } else {
                // Payment failed
                $this->log_error('Mpesa Callback Error: ' . json_encode($body));
                wp_send_json_error('Payment failed');
            }
            wp_die(); // Required to terminate immediately and return a proper response
        }

        private function log_error($message) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('Mpesa Plugin Error: ' . $message);
            }
        }
    }
}
