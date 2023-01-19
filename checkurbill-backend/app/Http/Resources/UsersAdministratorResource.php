<?php

namespace App\Http\Resources;

use App\Http\Controllers\LinkController;
use Illuminate\Http\Resources\Json\ResourceCollection;

class UsersAdministratorResource extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $linkcontrol = new LinkController;
        $links = $linkcontrol->generateLinks($this->getUrlRange(1, $this->lastPage()), $this->url($this->currentPage()));
        $prev = $linkcontrol->generatePrevLink($this->previousPageUrl(), $this->url($this->currentPage()));
        $nxt = $linkcontrol->generateNxtLink($this->nextPageUrl(), $this->url($this->currentPage()));

        return [
            'data' => UserResource::collection($this->collection),
            'links' => [$prev, ...$links, $nxt],
            'current_page' => $this->currentPage(),
            'from' => $this->firstItem(),
            'last_page' => $this->lastPage(),
            'path' => $this->getOptions()['path'],
            'per_page' => $this->perPage(),
            'to' => $this->lastItem(),
            'total' => $this->total(),
            'first_page_url' => $this->url(1),
            'last_page_url' => $this->url($this->lastPage()),
            'next_page_url' => $this->nextPageUrl(),
            'prev_page_url' => $this->previousPageUrl()
        ];
    }
}
