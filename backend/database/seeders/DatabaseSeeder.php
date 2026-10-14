<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\NewsPost;
use App\Models\Pet;
use App\Models\Service;
use App\Models\Testimonial;
use App\Models\User;
use App\Models\Vet;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ---- Admin account (credentials come from .env) ----
        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@pawavenue.test')],
            [
                'name' => env('ADMIN_NAME', 'Paw Avenue Sanctuary Admin'),
                'password' => env('ADMIN_PASSWORD', 'password123'),
                'role' => 'admin',
            ]
        );

        if (Pet::count() === 0) {
            $this->seedBaseContent();
        }

        // Safe to re-run: adds the newer sample content only when it is missing.
        $this->seedNewSamples();
    }

    /** Illustrated SAMPLE entries (Filipino characters, new rescues). Replace via the admin panel with real photos. */
    private function seedNewSamples(): void
    {
        $pets = [
            ['Mango', 'cat', 'Puspin', '/images/PETS/NEW/mango.svg'],
            ['Oreo', 'cat', 'Puspin', '/images/PETS/NEW/oreo.svg'],
            ['Biscuit', 'dog', 'Aspin', '/images/PETS/NEW/biscuit.svg'],
            ['Bantay', 'dog', 'Aspin', '/images/PETS/NEW/bantay.svg'],
        ];
        foreach ($pets as [$name, $species, $breed, $image]) {
            Pet::firstOrCreate(['name' => $name, 'species' => $species], [
                'breed' => $breed,
                'description' => "A rescued {$breed} at Paw Avenue, healing and ready for a forever home.",
                'image' => $image,
                'status' => 'available',
                'is_featured' => true,
            ]);
        }

        $vets = [
            ['Dr. Maria Santos', 'Dr. Maria Santos is a small-animal veterinarian who loves helping rescued cats and dogs recover. She leads our vaccination and wellness days.', '/images/VETS/DOC-MARIA.svg', 5],
            ['Dr. Miguel Reyes', 'Dr. Miguel Reyes focuses on surgery and rehabilitation for street animals, from first rescue to full recovery.', '/images/VETS/DOC-MIGUEL.svg', 6],
        ];
        foreach ($vets as [$name, $bio, $image, $order]) {
            Vet::firstOrCreate(['name' => $name], ['bio' => $bio, 'image' => $image, 'sort_order' => $order]);
        }

        $testimonials = [
            ['Angelica Ramos', 'Nurse', 'Adopting Mango was the best decision this year. The team guided me through everything, and he settled in within days.', '/images/CUSTOMERS/CUSTOMER-ANGEL.svg', 4],
            ['Paolo Mendoza', 'Software Developer', 'Biscuit is the happiest dog in our neighborhood. Thank you, Paw Avenue, for giving him and us a fresh start.', '/images/CUSTOMERS/CUSTOMER-PAOLO.svg', 5],
            ['Elizabeth Garcia', 'Teacher', 'The staff really cares about every animal. Our rescued cat is now part of the family.', '/images/CUSTOMERS/CUSTOMER-BETH.svg', 6],
        ];
        foreach ($testimonials as [$name, $role, $message, $image, $order]) {
            Testimonial::firstOrCreate(['name' => $name], ['role' => $role, 'message' => $message, 'image' => $image, 'sort_order' => $order]);
        }
    }

    private function seedBaseContent(): void
    {

        // ---- Pets (from the v1 gallery) ----
        $pets = [
            ['Yana', 'cat', 'Puspin', '/images/PETS/CATS/cats-1.jpg'],
            ['Hope', 'cat', 'Puspin', '/images/PETS/CATS/cats-2.jpg'],
            ['Dexter', 'cat', 'Puspin', '/images/PETS/CATS/cats-3.jpg'],
            ['Marsy', 'dog', 'Aspin', '/images/PETS/DOGS/dog-1.jpg'],
            ['Joe', 'dog', 'Aspin', '/images/PETS/DOGS/dog-2.jpg'],
            ['Chuk-Chuk', 'dog', 'Aspin', '/images/PETS/DOGS/dog-3.jpg'],
        ];
        foreach ($pets as [$name, $species, $breed, $image]) {
            Pet::create([
                'name' => $name,
                'species' => $species,
                'breed' => $breed,
                'description' => "A rescued {$breed} at Paw Avenue, healing and ready for a forever home.",
                'image' => $image,
                'status' => 'available',
                'is_featured' => true,
            ]);
        }

        // ---- Veterinarians ----
        $vets = [
            ['Doc Nielsen Donato', "Doc Nielsen has genuine love and compassion for animals. As the managing partner and chief surgeon of Vets in Practice (VIP), he tends to different kinds of pets every day. He also runs the Laguna Wildlife Park & Rescue Center in Pansol, where various animals are sheltered, including stray dogs.", '/images/VETS/DOC-NIEL.jpg'],
            ['Doc Ferds Recio', 'Doc Ferdinand "Ferds" Recio is skilled in Veterinary Medicine, human and animal health, TV hosting, and conducting seminars and webinars. Graduated from the University of the Philippines, he worked in Dubai, the US and Canada and travelled the world for work and experience.', '/images/VETS/DOC-FREDS.jpg'],
            ['Doc Joy Vinluan', "Dr. Joy Vinluan, a seasoned veterinarian, specializes in general practice, focusing on the well-being of dogs and cats. She brings her expertise and passion for animal care to Vetlife Animal Clinic in Pasay City, where she diligently attends to her patients' needs with compassion and dedication.", '/images/VETS/DOC-JOY.jpg'],
            ['Doc Racky Velasquez', 'Dr. Racky is renowned in the animal world, celebrated for his expertise and preparedness. With exceptional skills and a warm bedside manner, he tends to his patients at Mount Sinai Veterinary Practice, earning admiration throughout the community for his dedication to animal care.', '/images/VETS/DOC-RACKY.jpg'],
        ];
        foreach ($vets as $i => [$name, $bio, $image]) {
            Vet::create(['name' => $name, 'bio' => $bio, 'image' => $image, 'sort_order' => $i + 1]);
        }

        // ---- Services ----
        $services = [
            ['Pet Walking', '🦮', 'Our experienced dog and cat walkers provide your furry friend with the exercise and stimulation they need to stay happy and healthy.'],
            ['Pet Daycare', '🏡', 'Give your pet a fun-filled day of supervised play and socialization in our spacious daycare facility.'],
            ['Pet Grooming', '🛁', 'Treat your pet to a pampering session with our professional grooming services, leaving them looking and feeling their best.'],
            ['Pet Training', '🎾', 'Our expert trainers use positive reinforcement techniques to help your dog and cat learn obedience and good behavior.'],
            ['Veterinary Check-Ups', '🩺', "Ensure your pet's well-being with regular check-ups from our skilled veterinarians, who prioritize preventive care and early detection."],
            ['Pet Products', '🦴', "Explore our range of high-quality pet products, carefully selected to meet your pet's needs and enhance their quality of life."],
        ];
        foreach ($services as $i => [$title, $icon, $description]) {
            Service::create(['title' => $title, 'icon' => $icon, 'description' => $description, 'sort_order' => $i + 1]);
        }

        // ---- Testimonials ----
        $testimonials = [
            ['Ivy Castillo', 'College Student', 'I love how the pets in this shelter is very malambing, na kahit hindi nahing maganda ang mga bagay na naransan nila nung umpisa they still can love', '/images/CUSTOMERS/CUSTOMER-IVY.jpg'],
            ['Marv Alo', 'High School Student', 'Ang bait ng puspin na inampon ko, bukod sa malambing ay maalam din sya ng mga ilang tricks, this is the best website para mag ampon ng pets', '/images/CUSTOMERS/CUSTOMER-ALO.jpg'],
            ['Johansen Delos Reyes', 'IT Manager', 'I really love the dog that i adopt, even though he is not a high breed dog, he is intelligent and know many tricks', '/images/CUSTOMERS/CUSTOMER-JD.jpg'],
        ];
        foreach ($testimonials as $i => [$name, $role, $message, $image]) {
            Testimonial::create(['name' => $name, 'role' => $role, 'message' => $message, 'image' => $image, 'sort_order' => $i + 1]);
        }

        // ---- News ----
        NewsPost::create(['title' => 'Aspin and Puspin Day', 'image' => '/images/bg-2.jpg', 'author' => 'Admin', 'published_at' => '2022-08-18']);
        NewsPost::create(['title' => 'Inspiring Story of Bulcan Street Dog Shelter', 'image' => '/images/bg-8.jpg', 'author' => 'Admin', 'published_at' => '2022-04-07']);

        // ---- FAQs (one tip per line) ----
        $faqs = [
            ['How to train your pet dog?', "Reward good behavior with treats and praise.\nKeep training sessions brief and frequent.\nStay consistent with commands and expectations.\nUse clear, simple cues.\nBe patient and persistent."],
            ['How to manage your pets?', "Provide a comfortable and safe environment for your pets.\nEnsure they have access to food, water, and veterinary care.\nSpend quality time bonding with them through play and affection.\nTrain them using positive reinforcement techniques.\nRespect their individual needs and preferences."],
            ['What are the requirements for adopting pets?', "Complete an adoption application form.\nProvide proof of identification and residency.\nDemonstrate a stable living situation conducive to pet ownership.\nShow willingness and ability to provide proper care, including food, shelter, and veterinary needs.\nAgree to follow adoption guidelines and possibly undergo a home visit."],
        ];
        foreach ($faqs as $i => [$q, $a]) {
            Faq::create(['question' => $q, 'answer' => $a, 'sort_order' => $i + 1]);
        }
    }
}