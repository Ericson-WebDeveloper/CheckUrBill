<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MemberJsonResource extends JsonResource
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
            "account_no" => $this->account_no,
            "created_at"  => $this->created_at,
            "email" => $this->email,
            "first_name" => $this->first_name,
            "id" => $this->id,
            "last_name" => $this->last_name,
            "merchant_ref" => $this->merchant_ref,
            "middle_name" => $this->middle_name,
            "password" => $this->password == "" ? "Not Active" : "Active",
            "status" => $this->status,
            "remember_token" => $this->remember_token,
            "updated_at" => $this->updated_at
        ];
    }
}
