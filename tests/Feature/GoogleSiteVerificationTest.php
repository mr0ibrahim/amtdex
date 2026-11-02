<?php

use App\Models\BlogSetting;

it('exposes google site verification meta in the spa shell', function () {
    config(['services.google.site_verification' => 'gDpD7jQFW9Mj3HpAXHJcQF6V7LOgL_MYvXEA48ztdqg']);

    $response = $this->get('/');

    $response->assertOk()
        ->assertSee('name="google-site-verification"', false)
        ->assertSee('content="gDpD7jQFW9Mj3HpAXHJcQF6V7LOgL_MYvXEA48ztdqg"', false)
        ->assertSee('googleSiteVerification', false);
});

it('falls back to blog settings when env verification is empty', function () {
    config(['services.google.site_verification' => '']);
    BlogSetting::set('google_search_console', 'fallback-verification-token');

    $response = $this->get('/');

    $response->assertOk()
        ->assertSee('content="fallback-verification-token"', false);
});

it('serves the public google verification html helper page', function () {
    $this->get('/google-site-verification.html')
        ->assertOk()
        ->assertSee('gDpD7jQFW9Mj3HpAXHJcQF6V7LOgL_MYvXEA48ztdqg', false);
});
