<?php

namespace App\Http\Controllers\Api\V1\Blog;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use App\Models\BlogComment;
use App\Models\BlogPost;
use App\Models\BlogRedirect;
use App\Models\BlogSetting;
use App\Models\BlogTag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class PublicBlogController extends Controller
{
    /**
     * Get paginated published posts with filters.
     */
    public function posts(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', BlogSetting::get('posts_per_page', 9));
        $categorySlug = $request->input('category');
        $tagSlug = $request->input('tag');
        $search = $request->input('q');
        $featured = $request->boolean('featured');

        $query = BlogPost::query()
            ->published()
            ->with(['author:id,name,avatar,bio', 'category:id,name,slug', 'tags:id,name,slug'])
            ->latest('published_at');

        if ($featured) {
            $query->featured();
        }

        if ($categorySlug) {
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        if ($tagSlug) {
            $query->whereHas('tags', function ($q) use ($tagSlug) {
                $q->where('slug', $tagSlug);
            });
        }

        if ($search) {
            $query->search($search);
        }

        $posts = $query->paginate($perPage);

        return response()->json([
            'data' => $posts->items(),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
                'has_more' => $posts->hasMorePages(),
            ],
        ]);
    }

    /**
     * Get single post by slug, with views increment, related posts, and next/prev.
     */
    public function post(string $slug): JsonResponse
    {
        // 1. Check for 301 redirects first
        $redirect = BlogRedirect::trackAndRedirect("/posts/{$slug}");
        if ($redirect) {
            return response()->json([
                'redirect' => true,
                'status_code' => $redirect->status_code,
                'target' => $redirect->target_path,
            ], $redirect->status_code);
        }

        $post = BlogPost::where('slug', $slug)
            ->published()
            ->with([
                'author:id,name,avatar,bio,social_links',
                'category:id,name,slug,description',
                'tags:id,name,slug',
                'approvedComments',
            ])
            ->first();

        if (!$post) {
            return response()->json(['message' => 'المقال غير موجود أو غير منشور.'], 404);
        }

        // Increment views count safely
        $post->increment('views_count');

        // Related posts (same category or shared tags)
        $related = BlogPost::published()
            ->where('id', '!=', $post->id)
            ->where(function ($q) use ($post) {
                $q->where('category_id', $post->category_id)
                  ->orWhereHas('tags', function ($tq) use ($post) {
                      $tq->whereIn('blog_tags.id', $post->tags->pluck('id'));
                  });
            })
            ->with(['author:id,name,avatar', 'category:id,name,slug'])
            ->limit(3)
            ->get();

        // Next & Previous posts
        $next = BlogPost::published()
            ->where('published_at', '>', $post->published_at)
            ->orderBy('published_at', 'asc')
            ->select('id', 'title', 'slug', 'cover_image')
            ->first();

        $prev = BlogPost::published()
            ->where('published_at', '<', $post->published_at)
            ->orderBy('published_at', 'desc')
            ->select('id', 'title', 'slug', 'cover_image')
            ->first();

        return response()->json([
            'post' => $post,
            'related' => $related,
            'navigation' => [
                'next' => $next,
                'prev' => $prev,
            ],
        ]);
    }

    /**
     * Get all visible categories in hierarchical order.
     */
    public function categories(): JsonResponse
    {
        $categories = BlogCategory::visible()
            ->root()
            ->with(['children' => function ($q) {
                $q->visible()->withCount('publishedPosts');
            }])
            ->withCount('publishedPosts')
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json(['data' => $categories]);
    }

    /**
     * Get single category with posts.
     */
    public function category(string $slug): JsonResponse
    {
        $category = BlogCategory::where('slug', $slug)
            ->visible()
            ->with(['children' => fn ($q) => $q->visible()->withCount('publishedPosts')])
            ->withCount('publishedPosts')
            ->first();

        if (!$category) {
            return response()->json(['message' => 'التصنيف غير موجود.'], 404);
        }

        $posts = BlogPost::published()
            ->where('category_id', $category->id)
            ->with(['author:id,name,avatar', 'category:id,name,slug', 'tags:id,name,slug'])
            ->latest('published_at')
            ->paginate(9);

        return response()->json([
            'category' => $category,
            'posts' => $posts->items(),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    /**
     * Get all tags with post counts.
     */
    public function tags(): JsonResponse
    {
        $tags = BlogTag::withCount('publishedPosts')
            ->orderBy('published_posts_count', 'desc')
            ->get();

        return response()->json(['data' => $tags]);
    }

    /**
     * Get single tag with posts.
     */
    public function tag(string $slug): JsonResponse
    {
        $tag = BlogTag::where('slug', $slug)->withCount('publishedPosts')->first();

        if (!$tag) {
            return response()->json(['message' => 'الوسم غير موجود.'], 404);
        }

        $posts = BlogPost::published()
            ->whereHas('tags', fn ($q) => $q->where('slug', $slug))
            ->with(['author:id,name,avatar', 'category:id,name,slug'])
            ->latest('published_at')
            ->paginate(9);

        return response()->json([
            'tag' => $tag,
            'posts' => $posts->items(),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    /**
     * Store comment with XSS sanitization and moderation.
     */
    public function storeComment(Request $request, string $slug): JsonResponse
    {
        $post = BlogPost::where('slug', $slug)->published()->firstOrFail();

        if (!$post->allow_comments || !BlogSetting::get('comments_enabled', true)) {
            return response()->json(['message' => 'التعليقات معطلة على هذا المقال.'], 403);
        }

        $validated = $request->validate([
            'author_name' => 'required|string|min:2|max:80',
            'author_email' => 'required|email|max:120',
            'author_url' => 'nullable|url|max:200',
            'content' => 'required|string|min:3|max:1500',
            'parent_id' => 'nullable|exists:blog_comments,id',
        ]);

        $cleanContent = strip_tags($validated['content']);
        $autoApprove = !BlogSetting::get('comments_require_approval', true);

        $comment = BlogComment::create([
            'post_id' => $post->id,
            'parent_id' => $validated['parent_id'] ?? null,
            'author_name' => strip_tags($validated['author_name']),
            'author_email' => strtolower(trim($validated['author_email'])),
            'author_url' => $validated['author_url'] ?? null,
            'content' => $cleanContent,
            'status' => $autoApprove ? 'approved' : 'pending',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'ok' => true,
            'message' => $autoApprove
                ? 'تم نشر تعليقك بنجاح.'
                : 'تم استلام تعليقك وسيظهر بعد مراجعة الإدارة.',
            'comment' => $autoApprove ? $comment : null,
        ], 201);
    }

    /**
     * Get public blog settings.
     */
    public function settings(): JsonResponse
    {
        return response()->json(['settings' => BlogSetting::getAll()]);
    }

    /**
     * Generate dynamic RSS 2.0 Feed for blog subscribers and aggregators.
     */
    public function feed(): Response
    {
        $settings = BlogSetting::getAll();
        $posts = BlogPost::published()
            ->with(['author:id,name', 'category:id,name'])
            ->latest('published_at')
            ->limit(25)
            ->get();

        $subdomain = $settings['blog_subdomain'] ?? 'blog.amtdex.com';
        $baseUrl = "https://{$subdomain}";

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">';
        $xml .= '<channel>';
        $xml .= '<title>' . htmlspecialchars($settings['blog_title'] ?? 'مدونة Amtdex') . '</title>';
        $xml .= '<link>' . $baseUrl . '</link>';
        $xml .= '<description>' . htmlspecialchars($settings['blog_description'] ?? '') . '</description>';
        $xml .= '<language>ar</language>';
        $xml .= '<atom:link href="' . $baseUrl . '/feed" rel="self" type="application/rss+xml"/>';

        foreach ($posts as $post) {
            $postUrl = "{$baseUrl}/posts/{$post->slug}";
            $xml .= '<item>';
            $xml .= '<title>' . htmlspecialchars($post->title) . '</title>';
            $xml .= '<link>' . $postUrl . '</link>';
            $xml .= '<guid isPermaLink="true">' . $postUrl . '</guid>';
            $xml .= '<description><![CDATA[' . ($post->summary ?: Str::limit(strip_tags($post->content), 250)) . ']]></description>';
            $xml .= '<author>' . htmlspecialchars($post->author->name ?? 'Amtdex') . '</author>';
            if ($post->category) {
                $xml .= '<category>' . htmlspecialchars($post->category->name) . '</category>';
            }
            $xml .= '<pubDate>' . ($post->published_at ? $post->published_at->toRfc2822String() : '') . '</pubDate>';
            $xml .= '</item>';
        }

        $xml .= '</channel>';
        $xml .= '</rss>';

        if (ob_get_length()) {
            ob_clean();
        }

        return response(trim($xml), 200, ['Content-Type' => 'application/xml; charset=utf-8']);
    }

    /**
     * Generate dynamic sitemap.xml index and entries.
     */
    public function sitemap(): Response
    {
        $settings = BlogSetting::getAll();
        $subdomain = $settings['blog_subdomain'] ?? 'blog.amtdex.com';
        $baseUrl = "https://{$subdomain}";

        $posts = BlogPost::published()->select('slug', 'cover_image', 'updated_at', 'published_at')->get();
        $categories = BlogCategory::visible()->select('slug', 'updated_at')->get();
        $tags = BlogTag::select('slug', 'updated_at')->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';

        // Home
        $xml .= '<url>';
        $xml .= "<loc>{$baseUrl}/</loc>";
        $xml .= '<changefreq>daily</changefreq>';
        $xml .= '<priority>1.0</priority>';
        $xml .= '</url>';

        // Posts
        foreach ($posts as $post) {
            $xml .= '<url>';
            $xml .= "<loc>{$baseUrl}/posts/{$post->slug}</loc>";
            $xml .= '<lastmod>' . ($post->updated_at ?? $post->published_at)->toAtomString() . '</lastmod>';
            $xml .= '<changefreq>weekly</changefreq>';
            $xml .= '<priority>0.8</priority>';
            if ($post->cover_image) {
                $xml .= '<image:image>';
                $xml .= '<image:loc>' . htmlspecialchars($post->cover_image) . '</image:loc>';
                $xml .= '</image:image>';
            }
            $xml .= '</url>';
        }

        // Categories
        foreach ($categories as $cat) {
            $xml .= '<url>';
            $xml .= "<loc>{$baseUrl}/categories/{$cat->slug}</loc>";
            $xml .= '<lastmod>' . ($cat->updated_at ? $cat->updated_at->toAtomString() : now()->toAtomString()) . '</lastmod>';
            $xml .= '<changefreq>weekly</changefreq>';
            $xml .= '<priority>0.6</priority>';
            $xml .= '</url>';
        }

        // Tags
        foreach ($tags as $tag) {
            $xml .= '<url>';
            $xml .= "<loc>{$baseUrl}/tags/{$tag->slug}</loc>";
            $xml .= '<lastmod>' . ($tag->updated_at ? $tag->updated_at->toAtomString() : now()->toAtomString()) . '</lastmod>';
            $xml .= '<changefreq>monthly</changefreq>';
            $xml .= '<priority>0.4</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        if (ob_get_length()) {
            ob_clean();
        }

        return response(trim($xml), 200, ['Content-Type' => 'application/xml; charset=utf-8']);
    }
}
