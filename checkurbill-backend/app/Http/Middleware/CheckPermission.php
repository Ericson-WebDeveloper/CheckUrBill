<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, string $permission)
    {   
        $user = $request->user();
        $permissions = $user->getAllPermissions()->pluck('name');
        $haspermission = false;
        $permission = explode("|", $permission);
        Log::info($permission);
        foreach($permissions as $permiss) {
            if(in_array($permiss, $permission)) $haspermission = true;
        }
        
        if(!$haspermission) {
            return response()->json(['message' => 'you dont have right permission for this action'], 401);
        }
        return $next($request);
    }
}
