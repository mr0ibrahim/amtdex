<?php

use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

it('publishes scheduled posts whose time has arrived', function () {
    $author = User::create([
        'name' => 'ناشر مجدول',
        'email' => 'scheduler@amtdex.test',
        'password' => Hash::make('Amtdex2026!'),
        'role' => 'admin',
    ]);

    $due = BlogPost::create([
        'author_id' => $author->id,
        'title' => 'مقال مجدول حان موعده',
        'slug' => 'scheduled-due',
        'summary' => 'ملخص',
        'content' => '<p>محتوى</p>',
        'status' => 'scheduled',
        'published_at' => now()->subMinute(),
        'robots_index' => true,
        'robots_follow' => true,
        'og_type' => 'article',
        'twitter_card' => 'summary_large_image',
        'schema_type' => 'BlogPosting',
    ]);

    $future = BlogPost::create([
        'author_id' => $author->id,
        'title' => 'مقال مجدول لاحقاً',
        'slug' => 'scheduled-future',
        'summary' => 'ملخص',
        'content' => '<p>محتوى</p>',
        'status' => 'scheduled',
        'published_at' => now()->addDay(),
        'robots_index' => true,
        'robots_follow' => true,
        'og_type' => 'article',
        'twitter_card' => 'summary_large_image',
        'schema_type' => 'BlogPosting',
    ]);

    $this->artisan('blog:publish-scheduled')->assertSuccessful();

    expect($due->fresh()->status)->toBe('published')
        ->and($future->fresh()->status)->toBe('scheduled');
});
