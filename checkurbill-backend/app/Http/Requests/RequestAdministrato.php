<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RequestAdministrato extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'middlename' => 'required|string',
            'email' => 'required|email|unique:users,email',
            // 'password' => 'required|min:6',
            'gender' => 'required|string',
            'avatar' => 'required|string',
            'contact_no' => 'required|string',
            // 'permission' => 'required|string',
            'merchant_ref' => 'nullable|string'
        ];
    }
}
