<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
CREATE OR REPLACE FUNCTION fn_dashboard_stats() RETURNS json
LANGUAGE sql STABLE AS $$
    SELECT json_build_object(
        'pets_total',           (SELECT count(*) FROM pets),
        'pets_available',       (SELECT count(*) FROM pets WHERE status = 'available'),
        'pets_pending',         (SELECT count(*) FROM pets WHERE status = 'pending'),
        'pets_adopted',         (SELECT count(*) FROM pets WHERE status = 'adopted'),
        'vets',                 (SELECT count(*) FROM vets),
        'applications_total',   (SELECT count(*) FROM adoption_applications),
        'applications_pending', (SELECT count(*) FROM adoption_applications WHERE status = 'pending'),
        'messages_unread',      (SELECT count(*) FROM contact_messages WHERE is_read = false),
        'appointments_pending', (SELECT count(*) FROM appointments WHERE status = 'pending'),
        'recent_applications',  (
            SELECT coalesce(json_agg(r), '[]'::json) FROM (
                SELECT a.id, a.full_name, a.status, a.created_at, p.name AS pet
                FROM adoption_applications a
                LEFT JOIN pets p ON p.id = a.pet_id
                ORDER BY a.id DESC
                LIMIT 5
            ) r
        )
    );
$$;
SQL);
    }

    public function down(): void
    {
        DB::unprepared('DROP FUNCTION IF EXISTS fn_dashboard_stats()');
    }
};
