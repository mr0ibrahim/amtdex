<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\SubscribeNewsletterRequest;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;

class NewsletterController extends Controller
{
    /**
     * Subscribe email to newsletter.
     */
    public function store(SubscribeNewsletterRequest $request): JsonResponse
    {
        $subscriber = NewsletterSubscriber::firstOrCreate(
            ['email' => $request->email],
            ['is_active' => true]
        );

        return response()->json([
            'ok' => true,
            'message' => 'تم الاشتراك في النشرة البريدية بنجاح.',
            'id' => $subscriber->id,
        ], 201);
    }
}

