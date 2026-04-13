<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Task Management API
| Base URL: /api/v1
|
*/

Route::prefix('v1')->group(function () {
    Route::apiResource('tasks', TaskController::class);
});
