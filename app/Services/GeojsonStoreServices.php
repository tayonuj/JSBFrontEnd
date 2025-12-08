<?php
// app/Services/GISLayerService.php

namespace App\Services;

use App\Contracts\GISLayerServiceInterface;
use App\Models\DynamicGeoJSONModel;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Storage;

class GeojsonStoreServices
{

    public function storeData(&$data){
        foreach ($data as &$item) {
            $this->processNode($item['tree']);
        }
        $this->storeDataInMongoDB('mahaweli_layers', $data, 'layer');
        return "Data Stored Successfully";
    }


    protected function processNode(&$nodes) {
        foreach ($nodes as &$node) {
            // Check if the node is a file and has a file_name
            if ($node['type'] === 'file' && isset($node['file_name'])) {
                $filePath = storage_path($node['file_name']);
                if (Storage::exists($filePath)) {
                    $fileContent = Storage::get($filePath);
                    $name = $node['category_name']."_".$node['name'];
                    $node['collection_name'] = $this->processAndStore($fileContent,$name);
                }
            }

            // If the node has children, recursively process them
            if (!empty($node['children'])) {
                $this->processNode($node['children']);
            }
        }
    }

    public function processAndStore($geojsonFile,$name)
    {
        ini_set('memory_limit', '-1');

        // Load the geojson file
        $geojsonData = json_decode(Storage::get($geojsonFile), true);

        // Get collection name from metadata
        $collectionName = $name;

        // Store metadata in MongoDB
        $this->storeDataInMongoDB($collectionName, $this->getMetadata($geojsonData),'metadata');

        // Store each feature as a separate document in MongoDB

        $this->storeDataInMongoDB($collectionName, $this->getFeatures($geojsonData),'feature');

        return $collectionName;
    }


    protected function getMetadata($data)
    {
        return [
            "type" => $data["type"],
            "name" => $data["name"],
            "crs" => $data["crs"]
        ];
    }

    protected function getFeatures($data)
    {
        return $data["features"];
    }

    protected function storeDataInMongoDB($collectionName, $data,$type)
    {
        $model = new DynamicGeoJSONModel();
        $model->setCollectionName($collectionName);
        $model->create(['type' => $type, 'data' => $data]);
    }


}
