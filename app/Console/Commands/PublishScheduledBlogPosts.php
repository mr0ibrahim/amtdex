<?php

namespace App\Console\Commands;

use App\Models\BlogPost;
use App\Services\Blog\IndexNowService;
use Illuminate\Console\Command;

class PublishScheduledBlogPosts extends Command
{
    protected $signature = 'blog:publish-scheduled';

    protected $description = 'Publish blog posts whose scheduled publish time has arrived';

    public function handle(): int
    {
        $posts = BlogPost::query()
            ->where('status', 'scheduled')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->get();

        $count = 0;
        foreach ($posts as $post) {
            $post->update(['status' => 'published']);
            IndexNowService::submitPost($post->fresh() ?? $post);
            $count++;
        }

        $this->info("Published {$count} scheduled post(s).");

        return self::SUCCESS;
    }
}
