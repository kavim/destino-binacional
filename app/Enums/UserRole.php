<?php

namespace App\Enums;

enum UserRole: string
{
    case User = 'user';
    case Editor = 'editor';
    case Admin = 'admin';

    public function isStaff(): bool
    {
        return $this === self::Editor || $this === self::Admin;
    }

    /**
     * @return list<self>
     */
    public static function assignable(): array
    {
        return [self::Editor, self::Admin];
    }

    /**
     * @return list<string>
     */
    public static function assignableValues(): array
    {
        return array_map(fn (self $role) => $role->value, self::assignable());
    }
}
