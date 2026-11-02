<?php

namespace App\Console\Commands;

use App\Services\Blog\BlogSitemapBuilder;
use Illuminate\Console\Command;

class WritePublicSitemap extends Command
{
    protected $signature = 'seo:write-sitemap {--path= : Optional absolute path for sitemap.xml}';

    protected $description = 'Write a combined XML urlset to public/sitemap.xml for Search Console';

    public function handle(): int
    {
        $path = $this->option('path');
        $path = is_string($path) && $path !== '' ? $path : null;
        $written = BlogSitemapBuilder::writePublicSitemap($path);

        $this->info('Wrote sitemap: '.$written);
        $this->line('Submit in Search Console: '.BlogSitemapBuilder::sitemapIndexUrl());

        return self::SUCCESS;
    }
}
