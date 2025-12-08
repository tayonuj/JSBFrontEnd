<?php

use App\Http\Controllers\APIController;
use App\Http\Controllers\APIServiceController;
use App\Http\Controllers\BoundaryController;
use App\Http\Controllers\CustomLayerController;
use App\Http\Controllers\GISLayerController;
use App\Http\Controllers\GSentryRequestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('v1')->group(function () {
    Route::prefix('gis-layers')->group(function () {
        Route::get('/{projectCode}', [GISLayerController::class, 'getLayers']);
        Route::post('/readURL', [GISLayerController::class, 'readURL']);
        Route::post('/storeFile', [GISLayerController::class, 'storeFile']);
        Route::post('/saveGeoJSONData', [GISLayerController::class, 'saveGeoJSONData']);
    });

    Route::prefix('custom-layers')->group(function () {
        Route::post('/read', [CustomLayerController::class, 'readData']);
        Route::post('/save', [CustomLayerController::class, 'saveData']);
    });
    Route::prefix('query-layers')->group(function () {
        Route::post('/read', [CustomLayerController::class, 'readQueryData']);
        Route::post('/save', [CustomLayerController::class, 'saveQueryData']);
    });
    Route::prefix('admin-boundary')->group(function () {
        Route::post('/getList', [BoundaryController::class, 'getList']);
        Route::post('/groupData', [BoundaryController::class, 'groupData']);
    });

    Route::prefix('api-handling')->group(function () {
        Route::post('/request', [APIServiceController::class, 'request']);
    });

    Route::prefix('curl-requests')->group(function () {
        Route::post('/get', [GSentryRequestController::class, 'get']);
        Route::post('/post', [GSentryRequestController::class, 'post']);
    });
});
