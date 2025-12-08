<?php
// app/Services/GISLayerService.php

namespace App\Services;

use App\Contracts\GISLayerServiceInterface;
use App\Models\DynamicGeoJSONModel;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Storage;

class GISLayerService implements GISLayerServiceInterface
{

    public function curlRequest($url)
    {
        $client = new Client();
        try {
            $response = $client->request('POST', $url, [
                'verify' => false,
            ]);
            $response->getBody()->rewind();
            $geoJson = json_decode($response->getBody()->getContents(), true);
            return $geoJson;
        } catch (GuzzleException $e) {
            return ['http_status' => 'error', 'data' => $e];
        }
    }

    public function getLayers($projectCode)
    {
        // Define the directory where GIS layers are stored
        $directory = "Layers/Projects/{$projectCode}";

        // List files and directories in the specified directory
        $contents = Storage::disk('gcs')->listContents($directory, true);

        $layers = [];

        foreach ($contents as $content) {
            // Extract the relative path after $projectCode
            $relativePath = substr($content['path'], strlen($directory) + 1);

            // Split the relative path into parts
            $pathParts = explode('/', $relativePath);

            // Initialize the nested array
            $nestedArray = &$layers;

            // Build the nested array structure
            foreach ($pathParts as $part) {
                if (!isset($nestedArray[$part])) {
                    $nestedArray[$part] = [];
                }
                $nestedArray = &$nestedArray[$part];
            }

            // If it's a file, add it to the parent directory without an empty array
            if ($content['type'] === 'file') {
                $parentArray = &$layers;
                foreach ($pathParts as $index => $part) {
                    if ($index === count($pathParts) - 1) {
                        // This is the last part, add the file name to the parent directory
                        $parentArray[] = $part;
                    } else {
                        $parentArray = &$parentArray[$part];
                    }
                }
            }
        }

        // Remove any empty arrays
        $layers = $this->removeEmptyArrays($layers);

        // Return the nested array structure
        return $layers;
    }

    public function readLayers($path, $attribute = null, $filterValues = null) {
        $contents = Storage::disk('gcs')->url('Layers/Projects/'.$path);
        $client = new Client();
        try {
            $response = $client->request('GET', $contents, [
                'verify' => false,
            ]);
            $response->getBody()->rewind();
            $geoJson = json_decode($response->getBody()->getContents(), true);

            if ($attribute && $filterValues) {
                // If filtering parameters are provided, filter the GeoJSON data
                $geoJson = $this->filterGeoJson($geoJson, $attribute, $filterValues);
            }

            return $geoJson;
        } catch (GuzzleException $e) {
            return ['http_status' => 'error', 'data' => $e];
        }
    }

    private function filterGeoJson($geoJson, $attribute, $filterValues) {
        // Filter the features array
        $filteredFeatures = array_filter($geoJson['features'], function($feature) use ($attribute, $filterValues) {
            // Convert both the attribute value and filter values to lowercase for a case-insensitive comparison
            $attributeValue = strtolower($feature['properties'][$attribute]);
            $filterValuesLowercase = array_map('strtolower', $filterValues);
            return in_array($attributeValue, $filterValuesLowercase);
        });

        // Create a new GeoJSON object with the filtered features
        $filteredGeoJson = [
            'type' => 'FeatureCollection',
            'features' => array_values($filteredFeatures)  // Reset keys
        ];

        return $filteredGeoJson;
    }
    private function removeEmptyArrays($array)
    {
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $array[$key] = $this->removeEmptyArrays($value);
            }
        }

        // Remove elements with empty arrays
        $array = array_filter($array, function ($item) {
            return !empty($item);
        });

        return $array;
    }


}
