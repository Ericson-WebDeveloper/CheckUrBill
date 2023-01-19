<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MerchantOnBoardRequest extends FormRequest
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
            'merchant_code' => 'required|string|unique:merchants,merchant_code',
            'merchant_name' => 'required|string',
            'API_URL' => 'nullable|url',
            'checkurbills_schema' => 'required|string',
            'address' => 'required|string',
            'institution_type_id' => 'required|numeric',
            'merchant_category_id' => 'required|numeric',
            'merchant_type_id' => 'required|numeric',
            'contact_no' => 'required|string',
            'logo' => 'required|string'
        ];
    }
}
