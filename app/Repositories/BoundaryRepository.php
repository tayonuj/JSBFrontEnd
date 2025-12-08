<?php

namespace App\Repositories;

use App\Contracts\BoundaryRepositoryInterface;
use App\Models\CIDDB2019;
use InvalidArgumentException;

class BoundaryRepository implements BoundaryRepositoryInterface {

    public function getBoundaries(  $selectedBoundaryLevel,  $requestedBoundaryLevel, $value): array {
        switch ($requestedBoundaryLevel) {
            case 'District':
                return $this->getDistrictBoundaries();
            case 'DSD':
                return $this->getDSDBoundaries($selectedBoundaryLevel,$value);
            case 'GND':
                return $this->getGNDBoundaries($selectedBoundaryLevel, $value);
            case 'Cascade':
                return $this->getCascadeBoundaries($selectedBoundaryLevel, $value);
            default:
                throw new InvalidArgumentException("Invalid boundary level: $requestedBoundaryLevel");
        }
    }

    // ... inside the BoundaryRepository class ...

    protected function getDistrictBoundaries( ): array {
//        if ($value === 'all') {
            $boundaries = CIDDB2019::select('District')->whereNotNull('District')->groupBy('District')->pluck('District')->toArray();
//        } else {
//            $boundaries = [];
//        }
        return $boundaries;
    }

    protected function getDSDBoundaries( $selectedBoundaryLevel, $value): array {
        $boundaries = CIDDB2019::select('DSD')->where($selectedBoundaryLevel, $value)->whereNotNull('DSD')->groupBy('DSD')->pluck('DSD')->toArray();
        return $boundaries;
    }

    protected function getGNDBoundaries( $selectedBoundaryLevel, $value): array {
        $boundaries = CIDDB2019::select('GND')->where($selectedBoundaryLevel, $value)->whereNotNull('GND')->groupBy('GND')->pluck('GND')->toArray();
        return $boundaries;
    }

    protected function getCascadeBoundaries( $selectedBoundaryLevel, $value): array {
        $boundaries = CIDDB2019::select('cascade')->where($selectedBoundaryLevel, $value)->whereNotNull('cascade')->groupBy('cascade')->pluck('cascade')->toArray();
        return $boundaries;
    }


}
