<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreContactRequest;
use App\Http\Requests\Api\V1\StoreQuoteRequest;
use App\Models\AuditLog;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    /**
     * Submit Contact Form (Public)
     */
    public function storeContact(StoreContactRequest $request): JsonResponse
    {
        $lead = Lead::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'subject' => $request->subject ?? 'تواصل عام',
            'message' => $request->message,
            'status' => 'جديد',
            'source' => 'contact',
        ]);

        return response()->json([
            'ok' => true,
            'message' => 'تم استلام رسالتك بنجاح، وسنتواصل معك خلال 24 ساعة.',
            'id' => (string) $lead->id,
        ], 201);
    }

    /**
     * Submit Quote Request (Public)
     */
    public function storeQuote(StoreQuoteRequest $request): JsonResponse
    {
        $lead = Lead::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'subject' => $request->service,
            'message' => $request->details,
            'status' => 'جديد',
            'source' => 'quote',
            'meta' => [
                'service' => $request->service,
                'budget' => $request->budget,
                'timeline' => $request->timeline,
                'details' => $request->details,
            ],
        ]);

        return response()->json([
            'ok' => true,
            'message' => 'تم تقديم طلب عرض السعر بنجاح.',
            'id' => (string) $lead->id,
        ], 201);
    }

    /**
     * List Leads (Dashboard - Protected)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Lead::query()->latest();

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('source') && $request->source !== 'all') {
            $query->where('source', $request->source);
        }

        $perPage = (int) $request->input('per_page', 50);
        $paginator = $query->paginate($perPage);

        $formatted = collect($paginator->items())->map(function (Lead $lead) {
            return $lead->toApiResponse();
        });

        return response()->json([
            'data' => $formatted,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    /**
     * Update Lead Status (Protected - admin/editor)
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'string', 'in:جديد,قيد المراجعة,تم التواصل,مغلق'],
        ]);

        $lead = Lead::findOrFail($id);
        $oldStatus = $lead->status;
        $lead->status = $request->status;
        $lead->save();

        AuditLog::record(
            "تحديث حالة طلب #{$lead->id} من '{$oldStatus}' إلى '{$lead->status}'",
            $request->user()?->email
        );

        return response()->json([
            'ok' => true,
        ]);
    }

    /**
     * Delete Lead (Protected - admin only)
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $lead = Lead::findOrFail($id);
        $leadId = $lead->id;
        $lead->delete();

        AuditLog::record(
            "حذف طلب #{$leadId}",
            $request->user()?->email
        );

        return response()->json([
            'ok' => true,
        ]);
    }
}

