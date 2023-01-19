<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MerchantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'merchant_ref'=> $this->merchant_ref,
            'merchant_code'=> base64_encode($this->merchant_code),
            'merchant_name'=> $this->merchant_name,
            'lbp_enrolled_account'=> $this->lbp_enrolled_account,
            'checkurbills_schema'=> $this->checkurbills_schema,
            'status'=> $this->status,
            'API_URL'=> $this->API_URL,
            'created_at'=> $this->created_at,
            'updated_at'=> $this->updated_at,

            'detail_id' => $this->detail_id,
            'detail_merchant_id'=> $this->detail_merchant_id,
            'detail_address'=> $this->detail_address,
            'institution_type_id'=> $this->institution_type_id,
            'merchant_category_id'=> $this->merchant_category_id,
            'merchant_type_id'=> $this->merchant_type_id,

            'merchant_institution'=> $this->merchant_institution,
            'merchant_category'=> $this->merchant_category,
            'merchant_type'=> $this->merchant_type,

            'detail_contact_no'=> $this->detail_contact_no,
            'detail_logo'=> $this->detail_logo,
            'detail_created_at'=> $this->detail_created_at,
            'detail_updated_at'=> $this->detail_updated_at
        ];
    }
}
