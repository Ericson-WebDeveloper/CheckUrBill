<?php

declare(strict_types=1);

namespace App\Mapper;

use Illuminate\Http\Request;

class UserMapper {

    static function profileInfo(Request $request): array {
        return [
            'users.firstname' => $request->firstname,
            'users.lastname' => $request->lastname,
            'users.middlename' => $request->middlename,
            'users.email' => $request->email,
            'user_infos.gender' => $request->gender,
            'user_infos.contact_no' => $request->contact_no
        ];
    }
}