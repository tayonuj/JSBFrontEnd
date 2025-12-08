<?php

namespace App\Http\Controllers;

use App\Services\GeojsonStoreServices;
use App\Services\GISLayerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GISLayerController extends Controller
{

    protected $gisLayerService;
    protected $geojsonStoreService;

    public function __construct(GISLayerService $gisLayerService,GeojsonStoreServices $geojsonStoreService)
    {
        $this->gisLayerService = $gisLayerService;
        $this->geojsonStoreService = $geojsonStoreService;
    }

    public function getLayers(Request $request, $projectCode)
    {
        // Call the getLayers method on the instantiated GISLayerService
        $layers = $this->gisLayerService->getLayers($projectCode);
        $response =  response()->json(['data'=>$layers])->header('Content-Type', 'application/json charset=utf-8');
//        Log::info($response->getContent());
        return $response;

    }

    public function readURL(Request $request){
        $path = $request->input('path');
        $filter_attribute = $request->input('filter_attribute');
        $filter_array = $request->input('filter_array');
        $readFile = $this->gisLayerService->readLayers($path,$filter_attribute,$filter_array);
        return response()->json(['data'=>$readFile]);
    }

    public function storeFile(Request $request)
    {
        $filePath = $request->file('geojsonFile')->store('uploads');
        return response()->json(['data'=>$filePath]);
    }

    public function saveGeoJSONData(Request $request){
        $data = $request->input('dataset');
        $dataset = $this->geojsonStoreService->storeData($data);
        return response()->json(['data'=>$dataset]);
    }

}
