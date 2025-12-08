<?php
// app/Services/ApiService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ApiService
{
    public function request($url,$form_data)
    {
        // Decode the JSON data into an associative array
        $data = json_decode($form_data, true);

        // Check if json_decode failed
        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json(['error' => 'Invalid JSON data'], 400);
        }

        // Send a POST request with the data
        $response = Http::asForm()->withoutVerifying()->post($url, $data);
// Log the response
        Log::info('Status code:', [$response->status()]);
        Log::info('Headers:', [$response->headers()]);
        Log::info('Response body:', [$response->body()]);
        if ($response->successful()) {
            return $response->json();
        }

        // Handle error
        return response()->json(['error' => 'Failed to retrieve data','data'=>$data,'URL'=>$url], $response->status());
    }
}
