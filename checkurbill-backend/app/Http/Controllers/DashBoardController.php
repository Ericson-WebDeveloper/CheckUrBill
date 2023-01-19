<?php

namespace App\Http\Controllers;

use App\Interface\DashBoardInterface;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashBoardController extends Controller
{
    private DashBoardInterface $dashboard_repo;

    public function __construct(DashBoardInterface $dashboard_repo)
    {
        $this->dashboard_repo = $dashboard_repo;
    }

    public function administratorDashBoardDatas(): JsonResponse
    {
        try {
            $user_per_roles = $this->dashboard_repo->getTotalRoleUsers();
            $user_per_roles_permissions = $this->dashboard_repo->getTotalRolePermission();
            return response()->json([
                'data' => [
                    'user_per_roles' => $user_per_roles,
                    'user_per_roles_permissions' => $user_per_roles_permissions
                ]
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function merchantAdminsDashBoard(Request $request): JsonResponse
    {
        try {
            $user = $request->user()->load('info');
            $members = $this->dashboard_repo->countMembers($user->info->merchant_ref);
            $user_per_permissions = $this->dashboard_repo->getTotalUserPermissionRole('merchant');
            return response()->json([
                'data' => [
                    'members' => [array_merge(['name' => 'members'], (array)$members[0])],
                    'user_per_permissions' => $user_per_permissions
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

}
