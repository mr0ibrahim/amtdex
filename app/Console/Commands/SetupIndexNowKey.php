<?php

namespace App\Console\Commands;

use App\Services\Blog\IndexNowService;
use Illuminate\Console\Command;

class SetupIndexNowKey extends Command
{
    protected $signature = 'seo:setup-indexnow {--key= : Optional explicit IndexNow key}';

    protected $description = 'Generate or reuse the IndexNow ownership key (env or blog_settings)';

    public function handle(): int
    {
        $preferred = $this->option('key');
        $preferred = is_string($preferred) && $preferred !== '' ? $preferred : null;

        $result = IndexNowService::ensureConfigured($preferred);

        $this->info($result['generated'] ? 'Generated a new IndexNow key.' : 'IndexNow key already configured.');
        $this->line('Host: '.$result['host']);
        $this->line('Key location: '.$result['key_location']);

        return self::SUCCESS;
    }
}
