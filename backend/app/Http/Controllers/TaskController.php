<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TaskController extends Controller
{
    public function __construct(private readonly TaskService $taskService) {}

    /**
     * GET /tasks
     * List all tasks, optionally filtered by status.
     */
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $tasks  = $this->taskService->getAllTasks($status);
        $stats  = $this->taskService->getStatusStats();

        return response()->json([
            'data'  => TaskResource::collection($tasks),
            'stats' => $stats,
            'meta'  => [
                'total'  => $tasks->count(),
                'filter' => $status,
            ],
        ]);
    }

    /**
     * POST /tasks
     * Create a new task.
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = $this->taskService->createTask($request->validated());

        return response()->json([
            'message' => 'Task created successfully.',
            'data'    => new TaskResource($task),
        ], 201);
    }

    /**
     * GET /tasks/{id}
     * Show a single task.
     */
    public function show(Task $task): JsonResponse
    {
        return response()->json([
            'data' => new TaskResource($task),
        ]);
    }

    /**
     * PUT/PATCH /tasks/{id}
     * Update an existing task.
     */
    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $updated = $this->taskService->updateTask($task, $request->validated());

        return response()->json([
            'message' => 'Task updated successfully.',
            'data'    => new TaskResource($updated),
        ]);
    }

    /**
     * DELETE /tasks/{id}
     * Delete a task.
     */
    public function destroy(Task $task): JsonResponse
    {
        $this->taskService->deleteTask($task);

        return response()->json([
            'message' => 'Task deleted successfully.',
        ], 200);
    }
}
