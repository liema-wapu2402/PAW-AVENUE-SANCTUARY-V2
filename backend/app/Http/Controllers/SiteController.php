<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\AdoptionApplication;
use App\Models\ContactMessage;
use App\Models\Faq;
use App\Models\NewsPost;
use App\Models\Pet;
use App\Models\Service;
use App\Models\Testimonial;
use App\Models\Vet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Public (no login) endpoints that feed the visitor-facing site.
 */
class SiteController extends Controller
{
    public function home(): JsonResponse
    {
        return response()->json([
            'pets' => $this->petQuery()->where('is_featured', true)->limit(8)->get(),
            'testimonials' => Testimonial::orderBy('sort_order')->get(),
            'faqs' => Faq::orderBy('sort_order')->get(),
            'news' => NewsPost::orderByDesc('published_at')->limit(2)->get(),
            'stats' => [
                'adopted' => Pet::where('status', 'adopted')->count(),
                'available' => Pet::where('status', 'available')->count(),
                'vets' => Vet::count(),
                'services' => Service::count(),
            ],
        ]);
    }

    public function pets(Request $request): JsonResponse
    {
        $query = $this->petQuery();

        if (in_array($request->query('species'), ['dog', 'cat'], true)) {
            $query->where('species', $request->query('species'));
        }
        if (in_array($request->query('status'), ['available', 'pending', 'adopted'], true)) {
            $query->where('status', $request->query('status'));
        }
        if ($search = trim((string) $request->query('search'))) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")->orWhere('breed', 'ilike', "%{$search}%");
            });
        }

        return response()->json($query->get());
    }

    public function pet(Pet $pet): JsonResponse
    {
        return response()->json($pet);
    }

    public function vets(): JsonResponse
    {
        return response()->json(Vet::orderBy('sort_order')->get());
    }

    public function services(): JsonResponse
    {
        return response()->json(Service::orderBy('sort_order')->get());
    }

    public function news(): JsonResponse
    {
        return response()->json(NewsPost::orderByDesc('published_at')->limit(10)->get());
    }

    public function storeApplication(Request $request): JsonResponse
    {
        $data = $request->validate([
            'pet_id' => 'required|integer|exists:pets,id',
            'full_name' => 'required|string|max:120',
            'email' => 'required|email|max:160',
            'phone' => 'required|string|max:40',
            'address' => 'required|string|max:255',
            'living_situation' => 'nullable|string|max:60',
            'reason' => 'required|string|max:2000',
        ]);

        $pet = Pet::findOrFail($data['pet_id']);
        if ($pet->status === 'adopted') {
            return response()->json(['message' => $pet->name.' has already found a home.'], 422);
        }

        AdoptionApplication::create($data);

        return response()->json(['message' => 'Application received! Our team will contact you soon.'], 201);
    }

    public function storeContact(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'required|email|max:160',
            'subject' => 'required|string|max:160',
            'message' => 'required|string|max:3000',
        ]);

        ContactMessage::create($data);

        return response()->json(['message' => 'Thanks for reaching out! We will reply shortly.'], 201);
    }

    public function storeAppointment(Request $request): JsonResponse
    {
        $data = $request->validate([
            'full_name' => 'required|string|max:120',
            'email' => 'required|email|max:160',
            'phone' => 'nullable|string|max:40',
            'service' => 'required|string|max:80',
            'preferred_date' => 'nullable|date|after_or_equal:today',
            'notes' => 'nullable|string|max:1000',
        ]);

        Appointment::create($data);

        return response()->json(['message' => 'Consultation requested! We will confirm by email.'], 201);
    }

    private function petQuery()
    {
        return Pet::query()
            ->orderByRaw("case status when 'available' then 0 when 'pending' then 1 else 2 end")
            ->orderBy('id');
    }
}
