<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileInfoRequest extends FormRequest
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
            'lastname'=> ['required', 'string'],
            'middlename'=> ['required', 'string'],
            'email'=> ['required',  Rule::unique('users', 'email')->ignore($this->user_id)],
            'gender'=> ['required', 'string'],
            'contact_no'=> ['required', 'string'],
        ];
    }
}
