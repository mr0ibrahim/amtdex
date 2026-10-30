<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * List all dashboard users.
     */
    public function index(): JsonResponse
    {
        $users = User::all()->map(function (User $user) {
            return [
                'id' => (string) $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'viewer',
                'avatar' => $user->avatar,
                'bio' => $user->bio,
                'social_links' => $user->social_links,
                'createdAt' => $user->created_at?->toISOString() ?? now()->toISOString(),
            ];
        });

        return response()->json([
            'data' => $users,
        ]);
    }

    /**
     * Store new user.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['required', Rule::in(['admin', 'editor', 'author', 'viewer'])],
            'avatar' => ['nullable', 'string', 'max:500'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'social_links' => ['nullable', 'array'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'avatar' => $validated['avatar'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'social_links' => $validated['social_links'] ?? null,
            'email_verified_at' => now(),
        ]);

        AuditLog::record("إضافة مستخدم جديد: {$user->email} ({$user->role})", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => [
                'id' => (string) $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar,
                'bio' => $user->bio,
                'social_links' => $user->social_links,
            ],
        ], 201);
    }

    /**
     * Update existing user.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:100'],
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:6'],
            'role' => ['sometimes', Rule::in(['admin', 'editor', 'author', 'viewer'])],
            'avatar' => ['nullable', 'string', 'max:500'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'social_links' => ['nullable', 'array'],
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        AuditLog::record("تعديل بيانات المستخدم: {$user->email}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => [
                'id' => (string) $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar,
                'bio' => $user->bio,
                'social_links' => $user->social_links,
            ],
        ]);
    }

    /**
     * Delete user.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Prevent self deletion
        if ($request->user() && $request->user()->id === $user->id) {
            return response()->json(['message' => 'لا يمكنك حذف حسابك الحالي.'], 422);
        }

        // Prevent deleting the last admin
        if ($user->role === 'admin' && User::where('role', 'admin')->count() <= 1) {
            return response()->json(['message' => 'لا يمكن حذف المسؤول (Admin) الوحيد في النظام.'], 422);
        }

        $email = $user->email;
        $user->delete();

        AuditLog::record("حذف المستخدم: {$email}", $request->user()?->email);

        return response()->json([
            'ok' => true,
        ]);
    }
}

