<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Pagination\LengthAwarePaginator;

class TaskService
{
    /**
     * Retrieve all tasks with optional status filter.
     */
    public function getAllTasks(?string $status = null): \Illuminate\Database\Eloquent\Collection
    {
        $query = Task::latestFirst();

        if ($status && in_array($status, Task::STATUSES)) {
            $query->byStatus($status);
        }

        return $query->get();
    }

    /**
     * Create a new task.
     */
    public function createTask(array $data): Task
    {
        return Task::create([
            'title'       => $data['title'],
            'description' => $data['description'] ?? null,
            'status'      => $data['status'] ?? Task::STATUS_PENDING,
        ]);
    }

    /**
     * Update an existing task.
     */
    public function updateTask(Task $task, array $data): Task
    {
        $task->update(array_filter([
            'title'       => $data['title'] ?? $task->title,
            'description' => array_key_exists('description', $data) ? $data['description'] : $task->description,
            'status'      => $data['status'] ?? $task->status,
        ], fn($value) => $value !== null || array_key_exists('description', $data)));

        // Handle description explicitly since it can be null
        if (array_key_exists('description', $data)) {
            $task->description = $data['description'];
            $task->save();
        }

        return $task->fresh();
    }

    /**
     * Delete a task.
     */
    public function deleteTask(Task $task): bool
    {
        return $task->delete();
    }

    /**
     * Get task status statistics.
     */
    public function getStatusStats(): array
    {
        $counts = Task::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return [
            'pending'     => $counts['pending'] ?? 0,
            'in_progress' => $counts['in_progress'] ?? 0,
            'completed'   => $counts['completed'] ?? 0,
            'total'       => array_sum($counts),
        ];
    }
}
