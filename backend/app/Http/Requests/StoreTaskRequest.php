<?php

namespace App\Http\Requests;

use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'status'      => ['sometimes', Rule::in(Task::STATUSES)],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'A task title is required.',
            'title.max'      => 'The title may not exceed 255 characters.',
            'status.in'      => 'Status must be one of: pending, in_progress, completed.',
        ];
    }
}
