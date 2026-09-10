<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Services\DashboardActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        protected DashboardActivityLogger $activityLogger,
    ) {
        $this->authorizeResource(User::class);
    }

    public function index(): Response
    {
        $users = User::query()
            ->orderBy('name')
            ->paginate(15)
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role?->value,
                'created_at' => $user->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Dashboard/User/Index', [
            'users' => $users,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Dashboard/User/Create', [
            'roles' => $this->roleOptions(),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = new User;
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->password = Hash::make($data['password']);
        $user->role = UserRole::from($data['role']);
        $user->email_verified_at = now();
        $user->save();
        $this->activityLogger->created($user);

        return redirect()->route('users.index')
            ->with('success', 'Usuario creado.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('Dashboard/User/Edit', [
            'managedUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role?->value,
                'is_sole_admin' => $user->isSoleAdmin(),
            ],
            'roles' => $this->roleOptions(),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();

        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->role = UserRole::from($data['role']);

        if (! empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();
        $this->activityLogger->updated($user);

        return redirect()->route('users.index')
            ->with('success', 'Usuario actualizado.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()?->id) {
            return back()->with('error', 'No puedes eliminar tu propia cuenta desde aquí.');
        }

        $this->activityLogger->deleted($user);
        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'Usuario eliminado.');
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function roleOptions(): array
    {
        return [
            ['value' => UserRole::Editor->value, 'label' => 'Editor'],
            ['value' => UserRole::Admin->value, 'label' => 'Admin'],
        ];
    }
}
