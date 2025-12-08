<?php
// app/Contracts/GISLayerServiceInterface.php

namespace App\Contracts;

interface GISLayerServiceInterface
{
    /**
     * Get GIS layers for a given project code.
     *
     * @param string $projectCode
     * @return array
     */
    public function getLayers($projectCode);
    public function readLayers($path, $attribute = null, $filterValues = null);

    public function curlRequest($url);
}
