<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdoptionApplication;
use App\Models\Appointment;
use App\Models\ContactMessage;
use App\Models\Faq;
use App\Models\NewsPost;
use App\Models\Pet;
use App\Models\Service;
use App\Models\Testimonial;
use App\Models\Vet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * One admin controller for every manageable resource.
 *
 * Content resources (pets, vets, services, testimonials, news, faqs) get full CRUD.
 * Inbox resources (applications, messages, appointments) are created by visitors,
 * so admins can only list, change the status, and delete them.
 */
class ResourceController extends Controller
{
    private function definition(string $resource): array
    {
        $image = 'nullable|image|max:4096';

        return match ($resource) {
            'pets' => [
                'model' => Pet::class,
                'order' => ['id', 'desc'],
                'rules' => [
                    'name' => 'required|string|max:120',
                    'species' => 'required|in:dog,cat',
                    'breed' => 'nullable|string|max:120',
                    'age' => 'nullable|string|max:60',
                    'gender' => 'nullable|in:male,female',
                    'description' => 'nullable|string|max:2000',
                    'status' => 'required|in:available,pending,adopted',
                    'is_featured' => 'boolean',
                    'image' => $image,
                ],
            ],
            'vets' => [
                'model' => Vet::class,
                'order' => ['sort_order', 'asc'],
                'rules' => [
                    'name' => 'required|string|max:120',
                    'title' => 'required|string|max:120',
                    'bio' => 'nullable|string|max:3000',
                    'sort_order' => 'nullable|integer|min:0',
                    'image' => $image,
                ],
            ],
            'services' => [
                'model' => Service::class,
                'order' => ['sort_order', 'asc'],
                'rules' => [
                    'title' => 'required|string|max:120',
                    'icon' => 'nullable|string|max:16',
                    'description' => 'nullable|string|max:1000',
                    'sort_order' => 'nullable|integer|min:0',
                ],
            ],
            'testimonials' => [
                'model' => Testimonial::class,
                'order' => ['sort_order', 'asc'],
                'rules' => [
                    'name' => 'required|string|max:120',
                    'role' => 'nullable|string|max:120',
                    'message' => 'required|string|max:1500',
                    'sort_order' => 'nullable|integer|min:0',
                    'image' => $image,
                ],
            ],
            'news' => [
                'model' => NewsPost::class,
                'order' => ['published_at', 'desc'],
                'rules' => [
                    'title' => 'required|string|max:200',
                    'excerpt' => 'nullable|string|max:1000',
                    'author' => 'nullable|string|max:120',
                    'published_at' => 'nullable|date',
                    'image' => $image,
                ],
            ],
            'faqs' => [
                'model' => Faq::class,
                'order' => ['sort_order', 'asc'],
                'rules' => [
                    'question' => 'required|string|max:200',
                    'answer' => 'required|string|max:3000',
                    'sort_order' => 'nullable|integer|min:0',
                ],
            ],
            'applications' => [
                'model' => AdoptionApplication::class,
                'order' => ['id', 'desc'],
                'with' => ['pet:id,name,species,image'],
                'inbox' => true,
                'rules' => ['status' => 'required|in:pending,approved,rejected'],
            ],
            'messages' => [
                'model' => ContactMessage::class,
                'order' => ['id', 'desc'],
                'inbox' => true,
                'rules' => ['is_read' => 'required|boolean'],
            ],
            'appointments' => [
                'model' => Appointment::class,
                'order' => ['id', 'desc'],
                'inbox' => true,
                'rules' => ['status' => 'required|in:pending,confirmed,done,cancelled'],
            ],
            default => abort(404, 'Unknown resource.'),
        };
    }

    public function index(string $resource): JsonResponse
    {
        $def = $this->definition($resource);
        $query = $def['model']::query();

        if (! empty($def['with'])) {
            $query->with($def['with']);
        }

        return response()->json($query->orderBy($def['order'][0], $def['order'][1])->orderByDesc('id')->limit(500)->get());
    }

    public function store(Request $request, string $resource): JsonResponse
    {
        $def = $this->definition($resource);
        abort_if($def['inbox'] ?? false, 405, 'This resource is created by visitors.');

        $data = $request->validate($def['rules']);
        $data = $this->withUpload($request, $data);

        return response()->json($def['model']::create($data), 201);
    }

    public function update(Request $request, string $resource, int $id): JsonResponse
    {
        $def = $this->definition($resource);
        $record = $def['model']::findOrFail($id);

        $rules = array_map(fn ($rule) => 'sometimes|'.$rule, $def['rules']);
        $data = $this->withUpload($request, $request->validate($rules));

        $record->update($data);

        // Approving an application marks the pet as adopted.
        if ($resource === 'applications' && ($data['status'] ?? null) === 'approved' && $record->pet_id) {
            Pet::whereKey($record->pet_id)->update(['status' => 'adopted']);
        }

        return response()->json($record->fresh($def['with'] ?? []));
    }

    public function destroy(string $resource, int $id): JsonResponse
    {
        $def = $this->definition($resource);
        $def['model']::findOrFail($id)->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    /** Swap an uploaded `image` file for its public storage path and apply column defaults. */
    private function withUpload(Request $request, array $data): array
    {
        unset($data['image']);

        // Empty form inputs arrive as null; keep the column defaults for non-nullable columns.
        foreach (['sort_order' => 0, 'author' => 'Admin'] as $column => $default) {
            if (array_key_exists($column, $data) && $data[$column] === null) {
                $data[$column] = $default;
            }
        }

        if ($request->hasFile('image')) {
            // FILESYSTEM_DISK=public -> local disk; any other disk (s3 / Cloudflare R2) -> full public URL.
            $disk = config('filesystems.default');
            $path = $request->file('image')->store('uploads', $disk);
            $data['image'] = $disk === 'public'
                ? '/storage/'.$path
                : Storage::disk($disk)->url($path);
        }

        return $data;
    }
}
