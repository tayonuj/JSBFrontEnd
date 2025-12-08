<?php

namespace App\Providers;

use App\Contracts\BoundaryRepositoryInterface;
use App\Contracts\DataGroupedByBoundaryRepositoryInterface;
use App\Repositories\BoundaryRepository;
use App\Repositories\DataGroupedByBoundaryRepository;
use App\Services\ApiService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(BoundaryRepositoryInterface::class, BoundaryRepository::class);
        $this->app->bind(DataGroupedByBoundaryRepositoryInterface::class, DataGroupedByBoundaryRepository::class);
        $this->app->bind(ApiService::class, function ($app) {
            return new ApiService();
        });

    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
