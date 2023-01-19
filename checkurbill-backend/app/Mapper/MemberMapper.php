<?php

declare(strict_types=1);

namespace App\Mapper;

use Illuminate\Http\Request;

class MemberMapper {


    static function AddMemberMapper(Request $request): array 
    {
        return [
            'account_no' => $request->account_no,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'middle_name' => $request->middle_name,
            'email' => $request->email,
            // 'gender' => $request->gender,
            // 'contact_no' => $request->contact_no
        ];
    }
}