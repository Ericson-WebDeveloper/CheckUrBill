<?php

namespace App\Listeners;

use App\Mail\CreatedMerchantAdminNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class MerchantAdminCreateListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        // ->later(now()->addMinutes(10), new OrderShipped($order));
        Mail::to($event->user?->email)
        // ->send(new CreatedMerchantAdminNotification($event->user, $event->user_info, $event->merchant))
        ->later(now()->addMinutes(1), 
        new CreatedMerchantAdminNotification($event->user, $event->user_info, $event->merchant, $event->code, $event->password));
    }
}
