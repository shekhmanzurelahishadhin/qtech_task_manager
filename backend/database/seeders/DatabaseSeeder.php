<?php

namespace Database\Seeders;


class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\Task::factory()->count(10)->create();
    }
}
