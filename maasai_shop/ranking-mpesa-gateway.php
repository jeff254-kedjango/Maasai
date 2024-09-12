<?php
/*
Plugin Name: Ranking Mpesa WooCommerce Gateway
Description: Custom Mpesa payment gateway for WooCommerce.
Version: 1.6
Author: Kwemange Nyagrowa
*/

add_filter('woocommerce_payment_gateways', 'mpesa_add_gateway_class');
function mpesa_add_gateway_class($gateways) {
    $gateways[] = 'WC_Mpesa_Gateway'; 
    return $gateways;
}

add_action('plugins_loaded', 'mpesa_init_gateway_class');
function mpesa_init_gateway_class() {
    if (!class_exists('WC_Payment_Gateway')) return;

    class WC_Mpesa_Gateway extends WC_Payment_Gateway {
        
        public function __construct() {
            $this->id = 'mpesa';
            $this->icon = ''; 
            $this->has_fields = true;
            $this->method_title = 'Mpesa Gateway';
            $this->method_description = 'Mpesa Payment Gateway for WooCommerce';
            $this->supports = array('products');

            // Load settings
            $this->init_form_fields();
            $this->init_settings();

            // Get options from settings
            $this->title = $this->get_option('title');
            $this->description = $this->get_option('description');
            $this->consumer_key = $this->get_option('consumer_key');
            $this->consumer_secret = $this->get_option('consumer_secret');
            $this->shortcode = $this->get_option('shortcode');
            $this->passkey = $this->get_option('passkey');
            $this->sandbox = 'yes' === $this->get_option('sandbox');
            $this->callback_url = $this->get_option('callback_url');
            $this->sandbox_url = $this->get_option('sandbox_url');
            $this->production_url = $this->get_option('production_url');
            $this->unlock_fields = 'yes' === $this->get_option('unlock_fields'); // Unlock fields option

            // Add actions
            add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));
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
                'unlock_fields' => array(
                    'title' => 'Unlock Sensitive Fields',
                    'type' => 'checkbox',
                    'label' => 'Check this box to unlock Consumer Key, Consumer Secret, and Passkey fields for editing.',
                    'default' => 'no',
                    'description' => 'Once you have set these keys, they will be locked. You can unlock them temporarily using this option.'
                ),
                'consumer_key' => array(
                    'title' => 'Consumer Key',
                    'type' => 'text',
                    'default' => $this->get_option('consumer_key', ''),
                    'custom_attributes' => $this->unlock_fields ? array() : array('readonly' => 'readonly')
                ),
                'consumer_secret' => array(
                    'title' => 'Consumer Secret',
                    'type' => 'text',
                    'default' => $this->get_option('consumer_secret', ''),
                    'custom_attributes' => $this->unlock_fields ? array() : array('readonly' => 'readonly')
                ),
                'shortcode' => array(
                    'title' => 'Mpesa Shortcode',
                    'type' => 'text',
                    'default' => $this->get_option('shortcode', ''),
                    'custom_attributes' => $this->unlock_fields ? array() : array('readonly' => 'readonly')
                ),
                'passkey' => array(
                    'title' => 'Mpesa Passkey',
                    'type' => 'text',
                    'default' => $this->get_option('passkey', ''),
                    'custom_attributes' => $this->unlock_fields ? array() : array('readonly' => 'readonly')
                ),
                'callback_url' => array(
                    'title' => 'Callback URL',
                    'type' => 'text',
                    'description' => 'Enter the Callback URL where Mpesa will send the payment notification. It should be in the format: https://yourdomain.com/wp-admin/admin-ajax.php?action=mpesa_handle_callback.',
                    'default' => 'https://yourwebsite.com/wp-admin/admin-ajax.php?action=mpesa_handle_callback'
                ),
                'sandbox_url' => array(
                    'title' => 'Sandbox URL',
                    'type' => 'text',
                    'default' => 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
                ),
                'production_url' => array(
                    'title' => 'Production URL',
                    'type' => 'text',
                    'default' => 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
                ),
                'sandbox' => array(
                    'title' => 'Sandbox Mode',
                    'type' => 'checkbox',
                    'label' => 'Enable Sandbox Mode',
                    'default' => 'yes',
                ),
            );
        }

        public function process_admin_options() {
            // When unlock_fields is checked, allow the consumer_key, consumer_secret, and passkey to be edited
            $this->unlock_fields = isset($_POST[$this->plugin_id . $this->id . '_unlock_fields']) ? 'yes' : 'no';

            // Save settings, with special handling for sensitive fields
            if ($this->unlock_fields === 'yes') {
                $this->update_option('consumer_key', sanitize_text_field($_POST[$this->plugin_id . $this->id . '_consumer_key']));
                $this->update_option('consumer_secret', sanitize_text_field($_POST[$this->plugin_id . $this->id . '_consumer_secret']));
                $this->update_option('shortcode', sanitize_text_field($_POST[$this->plugin_id . $this->id . '_shortcode']));
                $this->update_option('passkey', sanitize_text_field($_POST[$this->plugin_id . $this->id . '_passkey']));
            }

            return parent::process_admin_options();
        }

        public function process_payment($order_id) {
            global $woocommerce;
            $order = wc_get_order($order_id);

            // Validate and sanitize phone number
            $phone_number = preg_replace('/[^0-9]/', '', sanitize_text_field($order->get_billing_phone()));
            
            if (!$phone_number || strlen($phone_number) < 9) {
                wc_add_notice('Invalid phone number', 'error');
                return;
            }

            // Process payment via Mpesa
            $result = $this->mpesa_payment_request($order->get_total(), $phone_number);

            if (isset($result->ResponseCode) && $result->ResponseCode == "0") {
                // Payment was successful
                $order->payment_complete();
                return array(
                    'result' => 'success',
                    'redirect' => $this->get_return_url($order),
                );
            } else {
                $this->log_error('Mpesa payment error: ' . $result->ResponseDescription);
                wc_add_notice('Payment error: ' . $result->ResponseDescription, 'error');
                return;
            }
        }

        public function mpesa_payment_request($amount, $phone_number) {
            $token = $this->get_mpesa_access_token();
            if (!$token) return false;

            $timestamp = date("YmdHis");
            $password = base64_encode($this->shortcode . $this->passkey . $timestamp);

            // Use test number for sandbox
            $phone_number_to_use = $this->sandbox ? '254708374149' : $phone_number;

            $data = array(
                'BusinessShortCode' => $this->shortcode,
                'Password' => $password,
                'Timestamp' => $timestamp,
                'TransactionType' => 'CustomerPayBillOnline',
                'Amount' => $amount,
                'PartyA' => $phone_number_to_use,
                'PartyB' => $this->shortcode,
                'PhoneNumber' => $phone_number_to_use,
                'CallBackURL' => $this->callback_url,
                'AccountReference' => 'Order' . time(),
                'TransactionDesc' => 'Payment for Order'
            );

            $url = $this->sandbox ? $this->sandbox_url : $this->production_url;

            $response = wp_remote_post($url, array(
                'headers' => array(
                    'Authorization' => 'Bearer ' . $token,
                    'Content-Type' => 'application/json'
                ),
                'body' => json_encode($data),
                'timeout' => 45,
            ));

            if (is_wp_error($response)) {
                $this->log_error('Mpesa request failed: ' . $response->get_error_message());
                return false;
            }

            return json_decode(wp_remote_retrieve_body($response));
        }

        private function get_mpesa_access_token() {
            $url = $this->sandbox ? $this->sandbox_url : $this->production_url;

            $response = wp_remote_post($url, array(
                'headers' => array(
                    'Authorization' => 'Basic ' . base64_encode($this->consumer_key . ':' . $this->consumer_secret),
                    'Content-Type' => 'application/json'
                ),
                'timeout' => 45,
            ));

            if (is_wp_error($response)) {
                $this->log_error('Mpesa access token request failed: ' . $response->get_error_message());
                return false;
            }

            $json = json_decode(wp_remote_retrieve_body($response));

            if (isset($json->access_token)) {
                return $json->access_token;
            } else {
                $this->log_error('Failed to get Mpesa access token.');
                return false;
            }
        }

        public function mpesa_handle_callback() {
            // Handle the callback from Mpesa
        }

        private function log_error($message) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log($message);
            }
        }
    }
}
