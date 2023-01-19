<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserAuthResource extends JsonResource
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
            "id" =>  $this->id,
            "firstname" =>  $this->firstname,
            "lastname" =>  $this->lastname,
            "middlename" =>  $this->middlename,
            "status" =>  $this->status,
            "email" =>  $this->email,
            "email_verified_at" =>  $this->email_verified_at,
            "created_at" =>  $this->created_at,
            "updated_at" => $this->updated_at,

            "roles" => RoleResource::collection($this->roles),
            "permissions" => PermissionResource::collection($this->permissions),
            "info" => new UserInfoResource($this->info)
        ];
    }
}
