<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactMessageMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public array $contactData;

    public function __construct(array $contactData)
    {
        $this->contactData = $contactData;
    }

    public function build(): self
    {
        return $this
            ->replyTo($this->contactData['email'], $this->contactData['name'])
            ->subject('New contact form message from ' . $this->contactData['name'])
            ->view('emails.contact-message');
    }
}
