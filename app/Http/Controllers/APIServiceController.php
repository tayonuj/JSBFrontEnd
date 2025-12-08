<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ApiService;
use Illuminate\Http\Request;

class APIServiceController extends Controller
{
    protected $apiService;

    public function __construct(ApiService $apiService)
    {
        $this->apiService = $apiService;
    }

    public function request(Request $request)
    {
        $url = $request->input('url');
        $form_data = $request->input('form_data');
        $response = $this->apiService->request($url,$form_data);

        return response()->json(['data' => $response]);
    }
}
