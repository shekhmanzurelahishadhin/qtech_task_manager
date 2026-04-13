<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    // =========================================================
    // INDEX
    // =========================================================

    public function test_can_list_all_tasks(): void
    {
        Task::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/tasks');

        $response->assertOk()
                 ->assertJsonStructure([
                     'data' => [['id', 'title', 'description', 'status', 'status_label', 'created_at', 'updated_at']],
                     'stats' => ['pending', 'in_progress', 'completed', 'total'],
                     'meta'  => ['total', 'filter'],
                 ]);

        $this->assertCount(3, $response->json('data'));
    }

    public function test_can_filter_tasks_by_status(): void
    {
        Task::factory()->pending()->count(2)->create();
        Task::factory()->completed()->count(1)->create();

        $response = $this->getJson('/api/v1/tasks?status=pending');

        $response->assertOk();
        $this->assertCount(2, $response->json('data'));
        foreach ($response->json('data') as $task) {
            $this->assertEquals('pending', $task['status']);
        }
    }

    public function test_returns_empty_array_when_no_tasks(): void
    {
        $response = $this->getJson('/api/v1/tasks');

        $response->assertOk();
        $this->assertCount(0, $response->json('data'));
    }

    // =========================================================
    // STORE
    // =========================================================

    public function test_can_create_a_task(): void
    {
        $payload = [
            'title'       => 'Build the API',
            'description' => 'Set up Laravel routes and controllers',
            'status'      => 'pending',
        ];

        $response = $this->postJson('/api/v1/tasks', $payload);

        $response->assertCreated()
                 ->assertJsonPath('data.title', 'Build the API')
                 ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('tasks', ['title' => 'Build the API']);
    }

    public function test_creates_task_with_default_pending_status(): void
    {
        $response = $this->postJson('/api/v1/tasks', ['title' => 'Quick task']);

        $response->assertCreated()
                 ->assertJsonPath('data.status', 'pending');
    }

    public function test_create_task_requires_title(): void
    {
        $response = $this->postJson('/api/v1/tasks', ['description' => 'No title here']);

        $response->assertUnprocessable()
                 ->assertJsonValidationErrors(['title']);
    }

    public function test_create_task_rejects_invalid_status(): void
    {
        $response = $this->postJson('/api/v1/tasks', [
            'title'  => 'Bad status',
            'status' => 'invalid_status',
        ]);

        $response->assertUnprocessable()
                 ->assertJsonValidationErrors(['status']);
    }

    // =========================================================
    // SHOW
    // =========================================================

    public function test_can_view_a_single_task(): void
    {
        $task = Task::factory()->create(['title' => 'My Task']);

        $response = $this->getJson("/api/v1/tasks/{$task->id}");

        $response->assertOk()
                 ->assertJsonPath('data.id', $task->id)
                 ->assertJsonPath('data.title', 'My Task');
    }

    public function test_returns_404_for_nonexistent_task(): void
    {
        $this->getJson('/api/v1/tasks/99999')
             ->assertNotFound();
    }

    // =========================================================
    // UPDATE
    // =========================================================

    public function test_can_update_a_task(): void
    {
        $task = Task::factory()->pending()->create();

        $response = $this->putJson("/api/v1/tasks/{$task->id}", [
            'title'  => 'Updated Title',
            'status' => 'in_progress',
        ]);

        $response->assertOk()
                 ->assertJsonPath('data.title', 'Updated Title')
                 ->assertJsonPath('data.status', 'in_progress');

        $this->assertDatabaseHas('tasks', [
            'id'     => $task->id,
            'title'  => 'Updated Title',
            'status' => 'in_progress',
        ]);
    }

    public function test_can_patch_only_status(): void
    {
        $task = Task::factory()->create(['title' => 'Original', 'status' => 'pending']);

        $this->patchJson("/api/v1/tasks/{$task->id}", ['status' => 'completed'])
             ->assertOk()
             ->assertJsonPath('data.status', 'completed')
             ->assertJsonPath('data.title', 'Original');
    }

    // =========================================================
    // DELETE
    // =========================================================

    public function test_can_delete_a_task(): void
    {
        $task = Task::factory()->create();

        $this->deleteJson("/api/v1/tasks/{$task->id}")
             ->assertOk()
             ->assertJsonPath('message', 'Task deleted successfully.');

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_delete_returns_404_for_nonexistent_task(): void
    {
        $this->deleteJson('/api/v1/tasks/99999')
             ->assertNotFound();
    }
}
