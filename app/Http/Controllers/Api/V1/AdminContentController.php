<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Faq;
use App\Models\Project;
use App\Models\Service;
use App\Models\TeamMember;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;

/** Administrative collections include drafts and hidden records, even if their public page is disabled. */
class AdminContentController extends Controller
{
    private const MODELS = [
        'services' => Service::class,
        'projects' => Project::class,
        'testimonials' => Testimonial::class,
        'faqs' => Faq::class,
        'team' => TeamMember::class,
        'clients' => Client::class,
    ];

    public function index(string $resource): JsonResponse
    {
        abort_unless(isset(self::MODELS[$resource]), 404);
        $model = self::MODELS[$resource];

        return response()->json([
            'data' => $model::query()->orderBy('sort_order')->orderBy('id')->get(),
        ]);
    }
}
