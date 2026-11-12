<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected bool $onDashboard = false;

    protected function asDashboard(): static
    {
        $this->onDashboard = true;

        return $this;
    }

    protected function prepareUrlForRequest($uri)
    {
        if ($this->onDashboard && is_string($uri) && str_starts_with($uri, '/')) {
            $uri = 'http://'.config('amtdex.dashboard_domain').$uri;
        }

        return parent::prepareUrlForRequest($uri);
    }
}

