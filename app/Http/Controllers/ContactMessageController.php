<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessageMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactMessageController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:120'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $recipient = env('CONTACT_FORM_TO_ADDRESS', config('mail.from.address'));

        if (empty($recipient)) {
            return response()->json([
                'message' => 'Contact mail recipient is not configured.',
            ], 500);
        }

        try {
            Mail::to($recipient)->send(new ContactMessageMail($validated));
        } catch (\Throwable $exception) {
            Log::error('Contact form mail send failed.', [
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'message' => 'We could not send your message right now. Please try again shortly.',
            ], 500);
        }

        return response()->json([
            'message' => 'Your message has been sent. We will get back to you soon.',
        ]);
    }
}
