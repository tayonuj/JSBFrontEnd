<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\MapDrawingLayers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CustomLayerController extends Controller
{
    public function readData(Request $request){
        $type = $request->input('type');
        $layerSet = MapDrawingLayers::where('layer_type','=',$type)->get();
        $dataset_list = MapDrawingLayers::where('layer_type','=',$type)->groupBy('name')->pluck('name')->toArray();
        return response()->json(['http_status'=>'success','layerSet'=>$layerSet,'layer_list'=>$dataset_list]);
    }
    public function saveData(Request $request){
        $created_by = $request->input('uid');
        $layerName = $request->input('layername');
        $layerType = $request->input('layerType');
        $jsonData = $request->input('jsonData');
        $filepath = 'mapLayers/'.$layerName.'.json';

        Storage::put($filepath,$jsonData);


        $mapLayers = new MapDrawingLayers();
        $mapLayers->name = $layerName;
        $mapLayers->layer_type = $layerType;
        $mapLayers->created_by = $created_by;
        $mapLayers->url = '../storage/'.$filepath;


        if ($mapLayers->save()){
            $layerSet = MapDrawingLayers::all();
            $dataset_list = MapDrawingLayers::where('layer_type','=',$layerType)->groupBy('name')->pluck('name')->toArray();
            return response()->json(['http_status'=>'success','layerSet'=>$layerSet,'message'=>'layer saved successfully','layer_list'=>$dataset_list]);
        }

    }

    public function saveQueryData(Request $request){
        $layerName = $request->input('layername');
        $jsonData = $request->input('jsonData');
        $filepath = 'queryLayers/'.$layerName.'.json';
        Storage::put($filepath,$jsonData);
        return response()->json(['http_status'=>'success','data'=>'../storage/'.$filepath]);
    }

    public function readQueryData(){
        $directory = 'queryLayers';
        $files = Storage::files($directory);

        $fileNames = array_map(function ($file) use ($directory) {
            $filenameWithoutExtension = pathinfo($file, PATHINFO_FILENAME);
            return str_replace($directory . '/', '', $filenameWithoutExtension);
        }, $files);

        return response()->json(['data'=>$fileNames]);
    }
}
