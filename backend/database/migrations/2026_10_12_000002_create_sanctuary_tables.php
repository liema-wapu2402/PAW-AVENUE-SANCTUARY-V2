<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('species', 10)->index();            // dog | cat
            $table->string('breed')->nullable();
            $table->string('age')->nullable();
            $table->string('gender', 10)->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->string('status', 15)->default('available')->index(); // available | pending | adopted
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });

        Schema::create('vets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('title')->default('Licensed Veterinarian');
            $table->text('bio')->nullable();
            $table->string('image')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('icon', 16)->nullable();            // emoji shown on the card
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role')->nullable();
            $table->text('message');
            $table->string('image')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('news_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('excerpt')->nullable();
            $table->string('image')->nullable();
            $table->string('author')->default('Admin');
            $table->date('published_at')->nullable();
            $table->timestamps();
        });

        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->text('answer');                             // one tip per line
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('adoption_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pet_id')->nullable()->constrained('pets')->nullOnDelete();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone', 40);
            $table->string('address');
            $table->string('living_situation', 60)->nullable();
            $table->text('reason');
            $table->string('status', 15)->default('pending')->index(); // pending | approved | rejected
            $table->timestamps();
        });

        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('subject');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone', 40)->nullable();
            $table->string('service');
            $table->date('preferred_date')->nullable();
            $table->text('notes')->nullable();
            $table->string('status', 15)->default('pending')->index(); // pending | confirmed | done | cancelled
            $table->timestamps();
        });
    }

    public function down(): void
    {
        foreach (['appointments', 'contact_messages', 'adoption_applications', 'faqs', 'news_posts', 'testimonials', 'services', 'vets', 'pets'] as $t) {
            Schema::dropIfExists($t);
        }
    }
};
