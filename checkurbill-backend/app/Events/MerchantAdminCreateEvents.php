<?php

namespace App\Events;

use App\Models\Merchant;
use App\Models\User;
use App\Models\UserInfo;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MerchantAdminCreateEvents
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public $user;
    public $user_info;
    public $merchant;
    public $code;
    public $password;
    public function __construct(User $user, UserInfo $user_info, Merchant $merchant, string $code, string $password)
    {
        $this->user = $user;
        $this->user_info = $user_info;
        $this->merchant = $merchant;
        $this->code = $code;
        $this->password = $password;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('channel-name');
    }
}
