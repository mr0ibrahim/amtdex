<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\Project;
use Illuminate\Http\JsonResponse;

class DashboardOverviewController extends Controller
{
    /**
     * Compute overview stats for the admin dashboard.
     */
    public function stats(): JsonResponse
    {
        $projectsCount = Project::where('is_published', true)->count();

        $contactCount = Lead::where('source', 'contact')->count();
        $contactToday = Lead::where('source', 'contact')
            ->whereDate('created_at', today())
            ->count();

        $quotesCount = Lead::where('source', 'quote')->count();
        $quotesPending = Lead::where('source', 'quote')
            ->whereIn('status', ['جديد', 'قيد المراجعة'])
            ->count();

        return response()->json([
            'activeProjects' => [
                'value' => $projectsCount,
                'sub' => 'مشاريع معتمدة',
            ],
            'contactRequests' => [
                'value' => $contactCount,
                'sub' => $contactToday > 0 ? "{$contactToday} جديدة اليوم" : 'طلبات التواصل',
            ],
            'quotes' => [
                'value' => $quotesCount,
                'sub' => $quotesPending > 0 ? "{$quotesPending} قيد المتابعة" : 'بانتظار الرد',
            ],
        ]);
    }
}

