<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /** Stats come from the fn_dashboard_stats() PostgreSQL function (see migrations). */
    public function __invoke(): JsonResponse
    {
        $row = DB::selectOne('select fn_dashboard_stats() as stats');

        return response()->json(json_decode($row->stats, true));
    }
}
