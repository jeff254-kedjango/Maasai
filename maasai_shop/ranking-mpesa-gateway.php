<?php
/*
Plugin Name: Mpesa Payment Gateway for WooCommerce with Debugging
Description: A WooCommerce plugin that integrates Mpesa payment gateway, handles callbacks, and provides comprehensive logging for debugging.
Version: 1.1
Author: Ranking Software & Tech
*/

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class WC_Mpesa_Payment_Gateway extends WC_Payment_Gateway {

    public function __construct() {
        $this->id = 'mpesa';
        $this->has_fields = false;
        $this->method_title = 'Mpesa Payment';
        $this->method_description = 'Mpesa Payment Gateway for WooCommerce with logging.';

        // Load the settings
        $this->init_form_fields();
        $this->init_settings();

        // Get settings
        $this->title = $this->get_option('title');
        $this->description = $this->get_option('description');
        $this->consumer_key = $this->get_option('consumer_key');
        $this->consumer_secret = $this->get_option('consumer_secret');
        $this->business_shortcode = $this->get_option('business_shortcode');
        $this->passkey = $this->get_option('passkey');
        $this->callback_url = home_url('/wc-api/mpesa_callback');
        $this->debug_mode = $this->get_option('debug_mode') === 'yes';

        // Actions
        add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));
        add_action('woocommerce_api_mpesa_callback', array($this, 'handle_mpesa_callback'));
    }

    // Initialize form fields for the admin settings page
    public function init_form_fields() {
        $this->form_fields = array(
            'enabled' => array(
                'title' => 'Enable/Disable',
                'type' => 'checkbox',
                'label' => 'Enable Mpesa Payment',
                'default' => 'yes',
            ),
            'title' => array(
                'title' => 'Title',
                'type' => 'text',
                'description' => 'This controls the title the user sees during checkout.',
                'default' => 'Mpesa Payment',
            ),
            'description' => array(
                'title' => 'Description',
                'type' => 'textarea',
                'description' => 'This controls the description the user sees during checkout.',
                'default' => 'Pay with Mpesa.',
            ),
            'consumer_key' => array(
                'title' => 'Consumer Key',
                'type' => 'text',
            ),
            'consumer_secret' => array(
                'title' => 'Consumer Secret',
                'type' => 'text',
            ),
            'business_shortcode' => array(
                'title' => 'Business Shortcode',
                'type' => 'text',
            ),
            'passkey' => array(
                'title' => 'Passkey',
                'type' => 'text',
            ),
            'debug_mode' => array(
                'title' => 'Debug Mode',
                'type' => 'checkbox',
                'label' => 'Enable Logging',
                'default' => 'no',
                'description' => 'Log Mpesa requests and responses to a log file for debugging.',
            ),
        );
    }

    // Process payment on checkout
    public function process_payment($order_id) {
        $order = wc_get_order($order_id);
        $phone_number = $order->get_billing_phone();
        $amount = $order->get_total();

        // Log the STK Push initiation
        $this->log("Initiating STK Push for Order #$order_id with Phone Number: $phone_number and Amount: $amount");

        $response = $this->send_stk_push($phone_number, $amount, $order_id);

        if ($response['ResponseCode'] == '0') {
            // Log successful STK Push request
            $this->log("STK Push success for Order #$order_id. Response: " . json_encode($response));

            $order->update_status('pending', 'Awaiting Mpesa payment confirmation');
            return array(
                'result' => 'success',
                'redirect' => $this->get_return_url($order),
            );
        } else {
            // Log error in STK Push request
            $this->log("STK Push failed for Order #$order_id. Error: " . json_encode($response));

            wc_add_notice('Mpesa payment failed. Please try again.', 'error');
            return array('result' => 'failure');
        }
    }

    // Send STK Push request to Mpesa
    private function send_stk_push($phone_number, $amount, $order_id) {
        $access_token = $this->get_access_token();

        $url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
        $timestamp = date('YmdHis');
        $password = base64_encode($this->business_shortcode . $this->passkey . $timestamp);

        $data = array(
            'BusinessShortCode' => $this->business_shortcode,
            'Password' => $password,
            'Timestamp' => $timestamp,
            'TransactionType' => 'CustomerPayBillOnline',
            'Amount' => $amount,
            'PartyA' => $phone_number,
            'PartyB' => $this->business_shortcode,
            'PhoneNumber' => $phone_number,
            'CallBackURL' => $this->callback_url,
            'AccountReference' => $order_id,
            'TransactionDesc' => 'Payment for Order #' . $order_id,
        );

        $response = wp_remote_post($url, array(
            'body' => json_encode($data),
            'headers' => array(
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $access_token,
            ),
        ));

        $body = wp_remote_retrieve_body($response);
        $this->log("Mpesa STK Push API Response for Order #$order_id: $body");
        return json_decode($body, true);
    }

    // Obtain access token from Mpesa
    private function get_access_token() {
        $url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

        $response = wp_remote_post($url, array(
            'headers' => array(
                'Authorization' => 'Basic ' . base64_encode($this->consumer_key . ':' . $this->consumer_secret),
            ),
        ));

        $body = wp_remote_retrieve_body($response);
        $access_token_data = json_decode($body, true);

        if (isset($access_token_data['access_token'])) {
            $this->log("Successfully retrieved Mpesa Access Token.");
            return $access_token_data['access_token'];
        } else {
            $this->log("Failed to retrieve Mpesa Access Token. Response: $body");
            return false;
        }
    }

    // Handle Mpesa callback
    public function handle_mpesa_callback() {
        $body = json_decode(file_get_contents('php://input'), true);
        $this->log("Mpesa Callback received: " . json_encode($body));

        if (isset($body['Body']['stkCallback']['ResultCode']) && $body['Body']['stkCallback']['ResultCode'] == 0) {
            $callback_data = $body['Body']['stkCallback']['CallbackMetadata']['Item'];

            $transaction_id = $callback_data[1]['Value'];
            $order_id = $callback_data[0]['Value'];

            $order = wc_get_order($order_id);

            if ($order) {
                // Mark order as paid
                $order->payment_complete($transaction_id);
                $order->add_order_note('Mpesa payment received via transaction ID ' . $transaction_id);

                $this->log("Mpesa payment successful for Order #$order_id. Transaction ID: $transaction_id");
            }
        } else {
            $this->log("Mpesa Callback failed. ResultCode: " . $body['Body']['stkCallback']['ResultCode']);
        }
        exit();
    }

    // Log information to a log file
    private function log($message) {
        if ($this->debug_mode) {
            $log_file = WP_CONTENT_DIR . '/mpesa_payment_gateway.log';
            $time = date("Y-m-d H:i:s");
            error_log("[$time] $message\n", 3, $log_file);
        }
    }
}

// Register Mpesa gateway
add_filter('woocommerce_payment_gateways', 'add_mpesa_gateway_class');
function add_mpesa_gateway_class($methods) {
    $methods[] = 'WC_Mpesa_Payment_Gateway';
    return $methods;
}

// Add settings link on the plugin page
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'mpesa_gateway_plugin_action_links');
function mpesa_gateway_plugin_action_links($links) {
    $settings_link = '<a href="admin.php?page=wc-settings&tab=checkout&section=mpesa">Settings</a>';
    array_unshift($links, $settings_link);
    return $links;
}
?>
