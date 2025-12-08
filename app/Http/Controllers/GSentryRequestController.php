<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\CurlRequestServices;
use Illuminate\Http\Request;

class GSentryRequestController extends Controller
{
    protected $curlRequestService;

    public function __construct(CurlRequestServices $curlRequestService)
    {
        ini_set('memory_limit', '-1');
        ini_set('max_execution_time', '900');
        $this->curlRequestService = $curlRequestService;
    }

    public function get(Request $request){
        $url = $request->input('url');
        $data = $request->input('data');
        if ($data) {
            $rtn_data = $this->curlRequestService->getRequest($url, $data);
        }
        else
            $rtn_data = $this->curlRequestService->getRequest($url);

        return response()->json(['data'=>$rtn_data]);
    }
    public function post(Request $request){
        $url = $request->input('url');
        $data = $request->input('data');



        $is_raw = $request->input('is_raw');
        if (!$is_raw || $is_raw == 'false')
            $is_raw = false;

        if ($data) {
            $data = json_decode($data);
            $rtn_data = $this->curlRequestService->postRequest($url, $data, $is_raw);
        }
        else
            $rtn_data = $this->curlRequestService->postRequest($url);

        return response()->json($rtn_data);
    }
}
