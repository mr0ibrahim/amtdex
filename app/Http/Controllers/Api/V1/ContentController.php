<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Client;
use App\Models\Faq;
use App\Models\PricingFeature;
use App\Models\PricingPlan;
use App\Models\Project;
use App\Models\Service;
use App\Models\TeamMember;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ContentController extends Controller
{
    // ── SERVICES ──

    public function services(): JsonResponse
    {
        $services = Service::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => $services,
        ]);
    }

    public function service(string $slug): JsonResponse
    {
        $service = Service::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return response()->json([
            'data' => $service,
        ]);
    }

    public function storeService(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'unique:services,slug'],
            'icon' => ['nullable', 'string', 'max:50'],
            'desc' => ['required', 'string'],
            'bullets' => ['nullable', 'array'],
            'tech' => ['nullable', 'array'],
            'detail' => ['nullable', 'string'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'og_image' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']);
        $validated['icon'] = $validated['icon'] ?? 'web';
        $validated['is_published'] = $validated['is_published'] ?? true;
        $validated['sort_order'] = $validated['sort_order'] ?? 0;

        $service = Service::create($validated);

        AuditLog::record("إضافة خدمة جديدة: {$service->title}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $service,
        ], 201);
    }

    public function updateService(Request $request, string $slug): JsonResponse
    {
        $service = Service::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'desc' => ['sometimes', 'string'],
            'icon' => ['nullable', 'string', 'max:50'],
            'bullets' => ['nullable', 'array'],
            'tech' => ['nullable', 'array'],
            'detail' => ['nullable', 'string'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'og_image' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        $service->update($validated);

        AuditLog::record("تعديل خدمة: {$service->slug}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $service,
        ]);
    }

    public function destroyService(Request $request, string $slug): JsonResponse
    {
        $service = Service::where('slug', $slug)->firstOrFail();
        $title = $service->title;
        $service->delete();

        AuditLog::record("حذف خدمة: {$title}", $request->user()?->email);

        return response()->json([
            'ok' => true,
        ]);
    }

    // ── PROJECTS ──

    public function projects(): JsonResponse
    {
        $projects = Project::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => $projects,
        ]);
    }

    public function project(string $slug): JsonResponse
    {
        $project = Project::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return response()->json([
            'data' => $project,
        ]);
    }

    public function storeProject(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'unique:projects,slug'],
            'cat' => ['required', 'string'],
            'client' => ['required', 'string'],
            'year' => ['nullable', 'string'],
            'stack' => ['nullable', 'array'],
            'color' => ['nullable', 'string'],
            'accent' => ['nullable', 'string'],
            'summary' => ['required', 'string'],
            'cover_image' => ['nullable', 'string'],
            'cover_image_alt' => ['nullable', 'string', 'max:255'],
            'gallery' => ['nullable', 'array'],
            'challenge' => ['nullable', 'string'],
            'deliverables' => ['nullable', 'array'],
            'metrics' => ['nullable', 'array'],
            'duration' => ['nullable', 'string', 'max:50'],
            'team_size' => ['nullable', 'string', 'max:50'],
            'project_url' => ['nullable', 'string', 'max:255'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'og_image' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']);
        $validated['is_published'] = $validated['is_published'] ?? true;
        $validated['sort_order'] = $validated['sort_order'] ?? 0;

        $project = Project::create($validated);

        AuditLog::record("إضافة مشروع جديد: {$project->title}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $project,
        ], 201);
    }

    public function updateProject(Request $request, string $slug): JsonResponse
    {
        $project = Project::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'cat' => ['sometimes', 'string'],
            'client' => ['sometimes', 'string'],
            'year' => ['nullable', 'string'],
            'stack' => ['nullable', 'array'],
            'color' => ['nullable', 'string'],
            'accent' => ['nullable', 'string'],
            'summary' => ['sometimes', 'string'],
            'cover_image' => ['nullable', 'string'],
            'cover_image_alt' => ['nullable', 'string', 'max:255'],
            'gallery' => ['nullable', 'array'],
            'challenge' => ['nullable', 'string'],
            'deliverables' => ['nullable', 'array'],
            'metrics' => ['nullable', 'array'],
            'duration' => ['nullable', 'string', 'max:50'],
            'team_size' => ['nullable', 'string', 'max:50'],
            'project_url' => ['nullable', 'string', 'max:255'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'og_image' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        $project->update($validated);

        AuditLog::record("تعديل مشروع: {$project->slug}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $project,
        ]);
    }

    public function destroyProject(Request $request, string $slug): JsonResponse
    {
        $project = Project::where('slug', $slug)->firstOrFail();
        $title = $project->title;
        $project->delete();

        AuditLog::record("حذف مشروع: {$title}", $request->user()?->email);

        return response()->json([
            'ok' => true,
        ]);
    }

    // ── PRICING PLANS ──

    public function pricing(): JsonResponse
    {
        $plans = PricingPlan::with('features')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => $plans,
        ]);
    }

    public function storePricingPlan(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'unique:pricing_plans,slug'],
            'badge' => ['nullable', 'string', 'max:100'],
            'description' => ['required', 'string'],
            'price' => ['required', 'string', 'max:50'],
            'currency' => ['nullable', 'string', 'max:3'],
            'period' => ['nullable', 'string', 'max:50'],
            'cta' => ['nullable', 'string', 'max:100'],
            'highlight' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
            'features' => ['nullable', 'array'],
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);
        $features = $validated['features'] ?? [];
        unset($validated['features']);

        $plan = PricingPlan::create($validated);

        foreach ($features as $idx => $feat) {
            $plan->features()->create([
                'text' => is_array($feat) ? ($feat['text'] ?? '') : $feat,
                'included' => is_array($feat) ? ($feat['included'] ?? true) : true,
                'sort_order' => $idx + 1,
            ]);
        }

        AuditLog::record("إضافة خطة تسعير جديدة: {$plan->name}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $plan->load('features'),
        ], 201);
    }

    public function updatePricingPlan(Request $request, int $id): JsonResponse
    {
        $plan = PricingPlan::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'badge' => ['nullable', 'string', 'max:100'],
            'description' => ['sometimes', 'string'],
            'price' => ['sometimes', 'string', 'max:50'],
            'currency' => ['nullable', 'string', 'max:3'],
            'period' => ['nullable', 'string', 'max:50'],
            'cta' => ['nullable', 'string', 'max:100'],
            'highlight' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
            'features' => ['nullable', 'array'],
        ]);

        if (isset($validated['features'])) {
            $features = $validated['features'];
            unset($validated['features']);
            $plan->features()->delete();
            foreach ($features as $idx => $feat) {
                $plan->features()->create([
                    'text' => is_array($feat) ? ($feat['text'] ?? '') : $feat,
                    'included' => is_array($feat) ? ($feat['included'] ?? true) : true,
                    'sort_order' => $idx + 1,
                ]);
            }
        }

        $plan->update($validated);

        AuditLog::record("تعديل خطة تسعير: {$plan->name}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $plan->load('features'),
        ]);
    }

    public function destroyPricingPlan(Request $request, int $id): JsonResponse
    {
        $plan = PricingPlan::findOrFail($id);
        $name = $plan->name;
        $plan->delete();

        AuditLog::record("حذف خطة تسعير: {$name}", $request->user()?->email);

        return response()->json(['ok' => true]);
    }

    // ── TESTIMONIALS ──

    public function testimonials(): JsonResponse
    {
        $testimonials = Testimonial::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => $testimonials,
        ]);
    }

    public function storeTestimonial(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'author' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'avatar' => ['nullable', 'string'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $testimonial = Testimonial::create($validated);

        AuditLog::record("إضافة رأي عميل جديد: {$testimonial->author}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $testimonial,
        ], 201);
    }

    public function updateTestimonial(Request $request, int $id): JsonResponse
    {
        $testimonial = Testimonial::findOrFail($id);

        $validated = $request->validate([
            'author' => ['sometimes', 'string', 'max:255'],
            'role' => ['sometimes', 'string', 'max:255'],
            'company' => ['sometimes', 'string', 'max:255'],
            'content' => ['sometimes', 'string'],
            'avatar' => ['nullable', 'string'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $testimonial->update($validated);

        AuditLog::record("تعديل رأي عميل: {$testimonial->author}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $testimonial,
        ]);
    }

    public function destroyTestimonial(Request $request, int $id): JsonResponse
    {
        $testimonial = Testimonial::findOrFail($id);
        $name = $testimonial->author;
        $testimonial->delete();

        AuditLog::record("حذف رأي عميل: {$name}", $request->user()?->email);

        return response()->json(['ok' => true]);
    }

    // ── FAQS ──

    public function faqs(): JsonResponse
    {
        $faqs = Faq::where('is_published', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => $faqs,
        ]);
    }

    public function storeFaq(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
            'category' => ['nullable', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        $faq = Faq::create($validated);

        AuditLog::record("إضافة سؤال شائع جديد", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $faq,
        ], 201);
    }

    public function updateFaq(Request $request, int $id): JsonResponse
    {
        $faq = Faq::findOrFail($id);

        $validated = $request->validate([
            'question' => ['sometimes', 'string', 'max:255'],
            'answer' => ['sometimes', 'string'],
            'category' => ['nullable', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        $faq->update($validated);

        AuditLog::record("تعديل سؤال شائع", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $faq,
        ]);
    }

    public function destroyFaq(Request $request, int $id): JsonResponse
    {
        $faq = Faq::findOrFail($id);
        $faq->delete();

        AuditLog::record("حذف سؤال شائع", $request->user()?->email);

        return response()->json(['ok' => true]);
    }

    // ── TEAM MEMBERS ──

    public function team(): JsonResponse
    {
        $team = TeamMember::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => $team,
        ]);
    }

    public function storeTeamMember(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'avatar' => ['nullable', 'string'],
            'social_links' => ['nullable', 'array'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $member = TeamMember::create($validated);

        AuditLog::record("إضافة عضو فريق جديد: {$member->name}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $member,
        ], 201);
    }

    public function updateTeamMember(Request $request, int $id): JsonResponse
    {
        $member = TeamMember::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'role' => ['sometimes', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'avatar' => ['nullable', 'string'],
            'social_links' => ['nullable', 'array'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $member->update($validated);

        AuditLog::record("تعديل عضو فريق: {$member->name}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $member,
        ]);
    }

    public function destroyTeamMember(Request $request, int $id): JsonResponse
    {
        $member = TeamMember::findOrFail($id);
        $name = $member->name;
        $member->delete();

        AuditLog::record("حذف عضو فريق: {$name}", $request->user()?->email);

        return response()->json(['ok' => true]);
    }

    // ── CLIENTS / PARTNERS ──

    public function clients(): JsonResponse
    {
        $clients = Client::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => $clients,
        ]);
    }

    public function storeClient(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'logo' => ['required', 'string'],
            'url' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $client = Client::create($validated);

        AuditLog::record("إضافة شريك/عميل جديد: {$client->name}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $client,
        ], 201);
    }

    public function updateClient(Request $request, int $id): JsonResponse
    {
        $client = Client::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'logo' => ['sometimes', 'string'],
            'url' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $client->update($validated);

        AuditLog::record("تعديل شريك/عميل: {$client->name}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $client,
        ]);
    }

    public function destroyClient(Request $request, int $id): JsonResponse
    {
        $client = Client::findOrFail($id);
        $name = $client->name;
        $client->delete();

        AuditLog::record("حذف شريك/عميل: {$name}", $request->user()?->email);

        return response()->json(['ok' => true]);
    }
}

