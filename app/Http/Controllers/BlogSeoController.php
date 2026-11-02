<?php

namespace App\Http\Controllers;

use App\Services\Blog\BlogSitemapBuilder;
use App\Services\Blog\IndexNowService;
use Illuminate\Http\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class BlogSeoController extends Controller
{
    public function robots(): Response
    {
        return response(BlogSitemapBuilder::robotsTxt(), 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
            'Cache-Control' => 'public, max-age=300',
        ]);
    }

    public function sitemapIndex(): Response
    {
        // Combined urlset (not a sitemapindex) so Google never follows child
        // /sitemaps/* URLs that some WAFs answer with HTML 403 pages.
        return $this->xml(BlogSitemapBuilder::combinedUrlsetXml());
    }

    public function sitemapPages(): Response
    {
        return $this->xml(BlogSitemapBuilder::pagesXml());
    }

    public function sitemapBlogPosts(?int $chunk = null): Response
    {
        return $this->xml(BlogSitemapBuilder::postsXml($chunk ?: 1));
    }

    public function sitemapBlogCategories(): Response
    {
        return $this->xml(BlogSitemapBuilder::categoriesXml());
    }

    public function sitemapBlogTags(): Response
    {
        return $this->xml(BlogSitemapBuilder::tagsXml());
    }

    /**
     * Back-compat single blog urlset.
     */
    public function sitemapBlogLegacy(): Response
    {
        return $this->xml(BlogSitemapBuilder::legacyBlogUrlset());
    }

    /**
     * Serve IndexNow key ownership file: /{key}.txt
     */
    public function indexNowKey(string $key): Response
    {
        $configured = IndexNowService::key();
        if ($configured === '' || ! hash_equals($configured, $key)) {
            throw new NotFoundHttpException();
        }

        return response($configured, 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }

    protected function xml(string $xml): Response
    {
        if (ob_get_length()) {
            @ob_clean();
        }

        return response(trim($xml), 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
            'Cache-Control' => 'public, max-age=300',
        ]);
    }
}
