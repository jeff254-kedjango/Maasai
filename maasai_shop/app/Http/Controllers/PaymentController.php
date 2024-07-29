<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    public function initiatePayment(Request $request)
    {
        $consumerKey = env('PESAPAL_CONSUMER_KEY');
        $consumerSecret = env('PESAPAL_CONSUMER_SECRET');

        $url = 'https://pesapal.com/api/PostPesapalDirectOrderV4';

        $payload = [
            'Amount' => $request->amount,
            'Description' => 'Order Payment',
            'Type' => 'MERCHANT',
            'Reference' => uniqid(),
            'FirstName' => $request->first_name,
            'LastName' => $request->last_name,
            'Email' => $request->email,
            'PhoneNumber' => $request->phone_number,
            'Currency' => 'KES',
            'CallBackUrl' => route('pesapal.callback')
        ];

        $response = Http::withBasicAuth($consumerKey, $consumerSecret)->post($url, $payload);

        if ($response->successful()) {
            return response()->json(['payment_url' => $response->json('redirect_url')]);
        } else {
            return response()->json(['error' => 'Unable to initiate payment'], 500);
        }
    }

    public function paymentCallback(Request $request)
    {
        // Handle the payment callback here
    }
}