<?php

namespace Tests\Unit;

use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskServiceTest extends TestCase
{
    use RefreshDatabase;

    private TaskService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new TaskService();
    }

    public function test_get_all_tasks_returns_all_when_no_filter(): void
    {
        Task::factory()->count(5)->create();

        $tasks = $this->service->getAllTasks();

        $this->assertCount(5, $tasks);
    }

    public function test_get_all_tasks_filters_by_status(): void
    {
        Task::factory()->pending()->count(3)->create();
        Task::factory()->completed()->count(2)->create();

        $pending = $this->service->getAllTasks('pending');

        $this->assertCount(3, $pending);
        $this->assertTrue($pending->every(fn($t) => $t->status === 'pending'));
    }

    public function test_get_all_tasks_ignores_invalid_status_filter(): void
    {
        Task::factory()->count(4)->create();

        $tasks = $this->service->getAllTasks('not_a_valid_status');

        $this->assertCount(4, $tasks);
    }

    public function test_create_task_with_all_fields(): void
    {
        $task = $this->service->createTask([
            'title'       => 'Write tests',
            'description' => 'PHPUnit feature and unit tests',
            'status'      => 'in_progress',
        ]);

        $this->assertInstanceOf(Task::class, $task);
        $this->assertEquals('Write tests', $task->title);
        $this->assertEquals('in_progress', $task->status);
        $this->assertDatabaseHas('tasks', ['title' => 'Write tests']);
    }

    public function test_create_task_defaults_to_pending_status(): void
    {
        $task = $this->service->createTask(['title' => 'Default status task']);

        $this->assertEquals(Task::STATUS_PENDING, $task->status);
    }

    public function test_update_task_changes_fields(): void
    {
        $task = Task::factory()->pending()->create(['title' => 'Old Title']);

        $updated = $this->service->updateTask($task, [
            'title'  => 'New Title',
            'status' => 'completed',
        ]);

        $this->assertEquals('New Title', $updated->title);
        $this->assertEquals('completed', $updated->status);
    }

    public function test_delete_task_removes_from_database(): void
    {
        $task = Task::factory()->create();
        $id   = $task->id;

        $result = $this->service->deleteTask($task);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('tasks', ['id' => $id]);
    }

    public function test_get_status_stats_returns_correct_counts(): void
    {
        Task::factory()->pending()->count(3)->create();
        Task::factory()->inProgress()->count(2)->create();
        Task::factory()->completed()->count(5)->create();

        $stats = $this->service->getStatusStats();

        $this->assertEquals(3, $stats['pending']);
        $this->assertEquals(2, $stats['in_progress']);
        $this->assertEquals(5, $stats['completed']);
        $this->assertEquals(10, $stats['total']);
    }

    public function test_tasks_are_returned_latest_first(): void
    {
        $first  = Task::factory()->create(['created_at' => now()->subDays(2)]);
        $second = Task::factory()->create(['created_at' => now()->subDay()]);
        $third  = Task::factory()->create(['created_at' => now()]);

        $tasks = $this->service->getAllTasks();

        $this->assertEquals($third->id, $tasks->first()->id);
        $this->assertEquals($first->id, $tasks->last()->id);
    }
}
