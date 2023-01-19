<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AccountEnrollRequest extends FormRequest
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
            'merchant' => 'required|string|max:255',
            'account_no' => 'required|string|max:255',
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'middlename' => 'required|string|max:255',
            'email' => 'required|string|email|unique:accounts,email',
        ];
    }
}
