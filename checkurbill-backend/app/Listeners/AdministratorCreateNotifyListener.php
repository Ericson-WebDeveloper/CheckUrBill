<?php

namespace App\Listeners;

use App\Mail\CreatedAdministratorNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class AdministratorCreateNotifyListener
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
        Mail::to($event?->user?->email)->send(
            new CreatedAdministratorNotification($event->user, $event->user_info, $event->code, $event->password));
    }
}
