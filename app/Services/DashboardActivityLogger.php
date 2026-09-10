<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class DashboardActivityLogger
{
    public function created(Model $model): void
    {
        $this->record(ActivityLog::ACTION_CREATED, $model);
    }

    public function updated(Model $model): void
    {
        $this->record(ActivityLog::ACTION_UPDATED, $model);
    }

    public function deleted(Model $model): void
    {
        $this->record(ActivityLog::ACTION_DELETED, $model);
    }

    public function record(string $action, Model $model): void
    {
        $user = Auth::user();

        if (! $user instanceof User) {
            return;
        }

        if ($model instanceof ActivityLog) {
            return;
        }

        ActivityLog::query()->create([
            'user_id' => $user->id,
            'action' => $action,
            'subject_type' => $model::class,
            'subject_id' => $model->getKey(),
            'subject_label' => $this->label($model),
        ]);
    }

    public function label(Model $model): string
    {
        if ($model instanceof User) {
            return trim($model->name.' ('.$model->email.')');
        }

        if ($model instanceof Category) {
            $name = $model->name_es ?: $model->name_pt;
            if (is_string($name) && $name !== '') {
                return $name;
            }
        }

        foreach (['name', 'title'] as $attribute) {
            $value = $model->getAttribute($attribute);
            if (is_string($value) && $value !== '') {
                return $value;
            }
        }

        return class_basename($model).' #'.$model->getKey();
    }
}
