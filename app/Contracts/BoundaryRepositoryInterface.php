<?php

namespace App\Contracts;

interface BoundaryRepositoryInterface {
    public function getBoundaries( $selectedBoundaryLevel, $requestedBoundaryLevel, $value): array;
}
