<?php

namespace App\Contracts;

interface DataGroupedByBoundaryRepositoryInterface {
    public function groupByColumnSum($boundaryColumn,$boundaryValue,$groupColumn, $valueColumn);
}
