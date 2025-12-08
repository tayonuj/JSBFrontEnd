<?php

use App\Http\Controllers\APIController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    // Vue SPA entry point
    return view('welcome');
});

// if you still want /temp to work:
Route::get('/temp', function () {
    return view('welcome');
});

// SPA catch-alls for sub-routes if needed
Route::get('/jsb', fn() => view('welcome'));
Route::get('/climate/project', fn() => view('welcome'));
Route::get('/project3', fn() => view('welcome'));
Route::get('/project4', fn() => view('welcome'));
Route::get('/project5', fn() => view('welcome'));

// keep your existing GIS / dashboard routes if you still use them:
Route::get('/tourismsector/{any}', fn () => view('welcome'));
Route::get('/data_analysis/{any}', fn () => view('welcome'));
Route::get('/dashboard/{any}', fn () => view('welcome'));

Route::get('/login', function () {
    return view('login');
});
