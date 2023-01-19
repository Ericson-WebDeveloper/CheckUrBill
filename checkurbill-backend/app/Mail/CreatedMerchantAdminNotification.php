<?php

namespace App\Mail;

use App\Models\Merchant;
use App\Models\User;
use App\Models\UserInfo;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CreatedMerchantAdminNotification extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
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
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'Created Merchant Admin Notification',
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        return new Content(
            view: 'mail.administrator.create-merchant-admin',
            with: [
                'user' => $this->user,
                'user_info' => $this->user_info,
                'merchant' => $this->merchant,
                'password' => $this->password,
                'link' => "http://localhost:3000/confirm-account/{$this->code}?expires=86400"
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        return [];
    }
}
