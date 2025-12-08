<?php

namespace App\Http\Controllers;

use App\Contracts\BoundaryRepositoryInterface;
use App\Contracts\DataGroupedByBoundaryRepositoryInterface;
use App\Repositories\DataGroupedByBoundaryRepository;
use Illuminate\Http\Request;

class BoundaryController extends Controller {

    protected BoundaryRepositoryInterface $boundaryRepository;
    protected DataGroupedByBoundaryRepositoryInterface $dataGroupedByBoundaryRepository;

    public function __construct(BoundaryRepositoryInterface $boundaryRepository ,
                                DataGroupedByBoundaryRepositoryInterface $dataGroupedByBoundaryRepository) {
        $this->boundaryRepository = $boundaryRepository;
        $this->dataGroupedByBoundaryRepository = $dataGroupedByBoundaryRepository;
    }

    public function getList(Request $request) {
        $selectedBoundaryLevel = $request->get('selected_boundary_level');
        $requestedBoundaryLevel = $request->get('requesting_boundary_level');
        $value = $request->get('value');
        $boundaries = $this->boundaryRepository->getBoundaries($selectedBoundaryLevel,$requestedBoundaryLevel, $value);
        return response()->json(['data'=>$boundaries]);
    }

    public function groupData(Request $request){
        $boundaryColumn = $request->input('boundary_column'); //ex : District
        $valueColumn = $request->input('value_column');      // ex : water surface
        $boundaryValue = $request->input('boundary_value'); //ex : Kururnegala
        $groupColumn = $request->input('group_column'); // ex: DSD
        $groupedData = $this->dataGroupedByBoundaryRepository->groupByColumnSum($boundaryColumn,$boundaryValue,$groupColumn, $valueColumn);
        return response()->json(['data'=>$groupedData]);

    }
}
