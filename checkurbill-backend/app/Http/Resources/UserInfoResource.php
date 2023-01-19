<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserInfoResource extends JsonResource
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
            "id" => $this->id,
            "user_id" => $this->user_id,
            "gender" => $this->gender,
            "avatar" => $this->avatar,
            "contact_no" => $this->contact_no,
            "merchant_ref" => $this->merchant_ref ? $this->merchant_ref : null,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at
        ];
    }
}
