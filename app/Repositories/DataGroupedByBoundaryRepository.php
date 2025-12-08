<?php

namespace App\Repositories;

use App\Contracts\DataGroupedByBoundaryRepositoryInterface;
use App\Models\CIDDB2019;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class DataGroupedByBoundaryRepository implements DataGroupedByBoundaryRepositoryInterface {
    protected CIDDB2019 $model;

    public function __construct(CIDDB2019 $model)
    {
        $this->model = $model;
    }
    public function groupByColumnSum($boundaryColumn, $boundaryValue, $groupColumn, $valueColumn)
    {
        $query = $this->model::select(
            $groupColumn,
            DB::raw("SUM($valueColumn) as count")
        );

        if ($boundaryValue !== 'All') {
            $query->where($boundaryColumn, $boundaryValue);
        }

        $dataset = $query->whereNotNull($groupColumn)
            ->groupBy($groupColumn)
            ->get();

        return $dataset;
    }

}
