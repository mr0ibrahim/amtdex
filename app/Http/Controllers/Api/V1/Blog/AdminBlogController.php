<?php

namespace App\Http\Controllers\Api\V1\Blog;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\BlogCategory;
use App\Models\BlogComment;
use App\Models\BlogPost;
use App\Models\BlogRedirect;
use App\Models\BlogRevision;
use App\Models\BlogSetting;
use App\Models\BlogTag;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminBlogController extends Controller
{
    /**
     * Get paginated posts for dashboard with status filters and search.
     */
    public function indexPosts(Request $request): JsonResponse
    {
        $status = $request->input('status');
        $categoryId = $request->input('category_id');
        $authorId = $request->input('author_id');
        $search = $request->input('q');

        $query = BlogPost::query()
            ->with(['author:id,name,email', 'category:id,name,slug', 'tags:id,name'])
            ->withCount('comments')
            ->latest('created_at');

        if ($status && in_array($status, ['draft', 'published', 'scheduled', 'archived'])) {
            $query->where('status', $status);
        }

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        if ($authorId) {
            $query->where('author_id', $authorId);
        }

        if ($search) {
            $query->search($search);
        }

        $posts = $query->paginate((int) $request->input('per_page', 15));

        return response()->json([
            'data' => $posts->items(),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
            'counts' => [
                'all' => BlogPost::count(),
                'published' => BlogPost::where('status', 'published')->count(),
                'draft' => BlogPost::where('status', 'draft')->count(),
                'scheduled' => BlogPost::where('status', 'scheduled')->count(),
                'archived' => BlogPost::where('status', 'archived')->count(),
            ],
        ]);
    }

    /**
     * Get single post for editing with revisions, tags, and category tree.
     */
    public function showPost(int $id): JsonResponse
    {
        $post = BlogPost::with(['tags', 'category', 'revisions.user:id,name'])
            ->withCount('comments')
            ->findOrFail($id);

        return response()->json([
            'post' => $post,
            'categories' => BlogCategory::orderBy('sort_order')->get(['id', 'name', 'parent_id']),
            'tags' => BlogTag::orderBy('name')->get(['id', 'name', 'slug']),
            'authors' => User::whereIn('role', ['admin', 'editor', 'author'])->get(['id', 'name', 'email', 'avatar']),
        ]);
    }

    /**
     * Store new blog post.
     */
    public function storePost(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blog_posts,slug',
            'category_id' => 'nullable|exists:blog_categories,id',
            'author_id' => 'nullable|exists:users,id',
            'summary' => 'nullable|string|max:1000',
            'content' => 'required|string',
            'cover_image' => 'nullable|string|max:500',
            'cover_image_alt' => 'nullable|string|max:255',
            'status' => 'required|in:draft,published,scheduled,archived',
            'published_at' => 'nullable|date',
            'is_featured' => 'boolean',
            'allow_comments' => 'boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'integer|exists:blog_tags,id',
            // SEO
            'focus_keyword' => 'nullable|string|max:100',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'canonical_url' => 'nullable|string|max:500',
            'robots_index' => 'boolean',
            'robots_follow' => 'boolean',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string|max:500',
            'og_image' => 'nullable|string|max:500',
            'og_type' => 'nullable|string|max:50',
            'twitter_card' => 'nullable|string|max:50',
            'twitter_title' => 'nullable|string|max:255',
            'twitter_description' => 'nullable|string|max:500',
            'twitter_image' => 'nullable|string|max:500',
            'schema_type' => 'nullable|string|max:50',
            'faq_schema' => 'nullable|array',
        ]);

        $slug = $validated['slug'] ? Str::slug($validated['slug']) : Str::slug($validated['title']);
        if (empty($slug)) {
            $slug = 'post-' . time();
        }

        // Ensure unique slug
        $originalSlug = $slug;
        $counter = 1;
        while (BlogPost::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }
        $validated['slug'] = $slug;

        $authorId = $validated['author_id'] ?? $request->user()->id;
        $validated['author_id'] = $authorId;
        $validated['reading_time_minutes'] = BlogPost::calculateReadingTime($validated['content']);

        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $tagIds = $validated['tags'] ?? [];
        unset($validated['tags']);

        $post = BlogPost::create($validated);

        if (!empty($tagIds)) {
            $post->tags()->sync($tagIds);
        }

        // Create initial revision
        BlogRevision::create([
            'post_id' => $post->id,
            'user_id' => $request->user()->id,
            'title' => $post->title,
            'summary' => $post->summary,
            'content' => $post->content,
            'created_at' => now(),
        ]);

        AuditLog::create([
            'user' => $request->user()->email,
            'action' => "إنشاء مقال جديد في المدونة: {$post->title}",
            'ip' => $request->ip(),
        ]);

        return response()->json(['ok' => true, 'post' => $post->load(['category', 'tags'])], 201);
    }

    /**
     * Update existing blog post.
     */
    public function updatePost(Request $request, int $id): JsonResponse
    {
        $post = BlogPost::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blog_posts,slug,' . $post->id,
            'category_id' => 'nullable|exists:blog_categories,id',
            'author_id' => 'nullable|exists:users,id',
            'summary' => 'nullable|string|max:1000',
            'content' => 'required|string',
            'cover_image' => 'nullable|string|max:500',
            'cover_image_alt' => 'nullable|string|max:255',
            'status' => 'required|in:draft,published,scheduled,archived',
            'published_at' => 'nullable|date',
            'is_featured' => 'boolean',
            'allow_comments' => 'boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'integer|exists:blog_tags,id',
            // SEO
            'focus_keyword' => 'nullable|string|max:100',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'canonical_url' => 'nullable|string|max:500',
            'robots_index' => 'boolean',
            'robots_follow' => 'boolean',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string|max:500',
            'og_image' => 'nullable|string|max:500',
            'og_type' => 'nullable|string|max:50',
            'twitter_card' => 'nullable|string|max:50',
            'twitter_title' => 'nullable|string|max:255',
            'twitter_description' => 'nullable|string|max:500',
            'twitter_image' => 'nullable|string|max:500',
            'schema_type' => 'nullable|string|max:50',
            'faq_schema' => 'nullable|array',
        ]);

        $oldSlug = $post->slug;
        $newSlug = $validated['slug'] ? Str::slug($validated['slug']) : $post->slug;

        // If slug changed, create an automatic 301 redirect
        if ($oldSlug !== $newSlug && !empty($newSlug)) {
            BlogRedirect::updateOrCreate(
                ['source_path' => "/posts/{$oldSlug}"],
                ['target_path' => "/posts/{$newSlug}", 'status_code' => 301]
            );
            $validated['slug'] = $newSlug;
        }

        $validated['reading_time_minutes'] = BlogPost::calculateReadingTime($validated['content']);

        if ($validated['status'] === 'published' && empty($post->published_at) && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $tagIds = $validated['tags'] ?? null;
        unset($validated['tags']);

        $post->update($validated);

        if (is_array($tagIds)) {
            $post->tags()->sync($tagIds);
        }

        // Save a revision
        BlogRevision::create([
            'post_id' => $post->id,
            'user_id' => $request->user()->id,
            'title' => $post->title,
            'summary' => $post->summary,
            'content' => $post->content,
            'created_at' => now(),
        ]);

        AuditLog::create([
            'user' => $request->user()->email,
            'action' => "تعديل مقال في المدونة: {$post->title}",
            'ip' => $request->ip(),
        ]);

        return response()->json(['ok' => true, 'post' => $post->fresh(['category', 'tags'])]);
    }

    /**
     * Delete a post.
     */
    public function destroyPost(Request $request, int $id): JsonResponse
    {
        $post = BlogPost::findOrFail($id);
        $title = $post->title;
        $post->delete();

        AuditLog::create([
            'user' => $request->user()->email,
            'action' => "حذف مقال من المدونة: {$title}",
            'ip' => $request->ip(),
        ]);

        return response()->json(['ok' => true, 'message' => 'تم حذف المقال بنجاح.']);
    }

    /**
     * Bulk actions for posts.
     */
    public function bulkAction(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:blog_posts,id',
            'action' => 'required|in:publish,draft,archive,delete,change_category',
            'category_id' => 'nullable|exists:blog_categories,id',
        ]);

        $ids = $validated['ids'];
        $action = $validated['action'];

        switch ($action) {
            case 'publish':
                BlogPost::whereIn('id', $ids)->update(['status' => 'published', 'published_at' => now()]);
                break;
            case 'draft':
                BlogPost::whereIn('id', $ids)->update(['status' => 'draft']);
                break;
            case 'archive':
                BlogPost::whereIn('id', $ids)->update(['status' => 'archived']);
                break;
            case 'change_category':
                if (isset($validated['category_id'])) {
                    BlogPost::whereIn('id', $ids)->update(['category_id' => $validated['category_id']]);
                }
                break;
            case 'delete':
                BlogPost::whereIn('id', $ids)->delete();
                break;
        }

        return response()->json(['ok' => true, 'message' => 'تم تنفيذ الإجراء الجماعي بنجاح.']);
    }

    /**
     * Categories CRUD
     */
    public function categories(): JsonResponse
    {
        $cats = BlogCategory::withCount('posts')->orderBy('sort_order')->get();
        return response()->json(['data' => $cats]);
    }

    public function storeCategory(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|exists:blog_categories,id',
            'name' => 'required|string|max:100',
            'slug' => 'nullable|string|max:100|unique:blog_categories,slug',
            'description' => 'nullable|string|max:500',
            'image' => 'nullable|string|max:500',
            'sort_order' => 'integer',
            'is_visible' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'canonical_url' => 'nullable|string|max:500',
            'noindex' => 'boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category = BlogCategory::create($validated);
        return response()->json(['ok' => true, 'category' => $category], 201);
    }

    public function updateCategory(Request $request, int $id): JsonResponse
    {
        $category = BlogCategory::findOrFail($id);
        $validated = $request->validate([
            'parent_id' => 'nullable|exists:blog_categories,id|not_in:' . $id,
            'name' => 'required|string|max:100',
            'slug' => 'nullable|string|max:100|unique:blog_categories,slug,' . $id,
            'description' => 'nullable|string|max:500',
            'image' => 'nullable|string|max:500',
            'sort_order' => 'integer',
            'is_visible' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'canonical_url' => 'nullable|string|max:500',
            'noindex' => 'boolean',
        ]);

        $category->update($validated);
        return response()->json(['ok' => true, 'category' => $category]);
    }

    public function destroyCategory(int $id): JsonResponse
    {
        $category = BlogCategory::findOrFail($id);
        $category->delete();
        return response()->json(['ok' => true, 'message' => 'تم حذف التصنيف بنجاح.']);
    }

    /**
     * Tags CRUD
     */
    public function tags(): JsonResponse
    {
        $tags = BlogTag::withCount('posts')->orderBy('name')->get();
        return response()->json(['data' => $tags]);
    }

    public function storeTag(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:60',
            'slug' => 'nullable|string|max:60|unique:blog_tags,slug',
            'description' => 'nullable|string|max:300',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'noindex' => 'boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $tag = BlogTag::create($validated);
        return response()->json(['ok' => true, 'tag' => $tag], 201);
    }

    public function updateTag(Request $request, int $id): JsonResponse
    {
        $tag = BlogTag::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:60',
            'slug' => 'nullable|string|max:60|unique:blog_tags,slug,' . $id,
            'description' => 'nullable|string|max:300',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'noindex' => 'boolean',
        ]);

        $tag->update($validated);
        return response()->json(['ok' => true, 'tag' => $tag]);
    }

    public function destroyTag(int $id): JsonResponse
    {
        $tag = BlogTag::findOrFail($id);
        $tag->delete();
        return response()->json(['ok' => true, 'message' => 'تم حذف الوسم بنجاح.']);
    }

    /**
     * Comments Moderation
     */
    public function comments(Request $request): JsonResponse
    {
        $status = $request->input('status');
        $query = BlogComment::with(['post:id,title,slug'])->latest();

        if ($status && in_array($status, ['pending', 'approved', 'rejected', 'spam'])) {
            $query->where('status', $status);
        }

        $comments = $query->paginate(20);
        return response()->json([
            'data' => $comments->items(),
            'meta' => [
                'current_page' => $comments->currentPage(),
                'last_page' => $comments->lastPage(),
                'total' => $comments->total(),
            ],
            'counts' => [
                'pending' => BlogComment::where('status', 'pending')->count(),
                'approved' => BlogComment::where('status', 'approved')->count(),
                'rejected' => BlogComment::where('status', 'rejected')->count(),
                'spam' => BlogComment::where('status', 'spam')->count(),
            ],
        ]);
    }

    public function updateCommentStatus(Request $request, int $id): JsonResponse
    {
        $comment = BlogComment::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected,spam',
        ]);

        $comment->update(['status' => $validated['status']]);
        return response()->json(['ok' => true, 'comment' => $comment]);
    }

    public function destroyComment(int $id): JsonResponse
    {
        $comment = BlogComment::findOrFail($id);
        $comment->delete();
        return response()->json(['ok' => true, 'message' => 'تم حذف التعليق بنجاح.']);
    }

    /**
     * 301 Redirects Management
     */
    public function redirects(): JsonResponse
    {
        $redirects = BlogRedirect::latest()->get();
        return response()->json(['data' => $redirects]);
    }

    public function storeRedirect(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'source_path' => 'required|string|unique:blog_redirects,source_path',
            'target_path' => 'required|string',
            'status_code' => 'required|in:301,302',
        ]);

        $redirect = BlogRedirect::create($validated);
        return response()->json(['ok' => true, 'redirect' => $redirect], 201);
    }

    public function destroyRedirect(int $id): JsonResponse
    {
        $redirect = BlogRedirect::findOrFail($id);
        $redirect->delete();
        return response()->json(['ok' => true, 'message' => 'تم حذف التحويل بنجاح.']);
    }

    /**
     * Blog Settings
     */
    public function getSettings(): JsonResponse
    {
        return response()->json(['settings' => BlogSetting::getAll()]);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        $settings = $request->all();
        foreach ($settings as $key => $value) {
            BlogSetting::set($key, $value);
        }

        AuditLog::create([
            'user' => $request->user()->email,
            'action' => 'تحديث إعدادات المدونة ونظام SEO',
            'ip' => $request->ip(),
        ]);

        return response()->json(['ok' => true, 'settings' => BlogSetting::getAll()]);
    }

    /**
     * Dashboard Overview Statistics
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'total_posts' => BlogPost::count(),
            'published_posts' => BlogPost::where('status', 'published')->count(),
            'total_views' => BlogPost::sum('views_count'),
            'pending_comments' => BlogComment::where('status', 'pending')->count(),
            'top_posts' => BlogPost::published()->orderBy('views_count', 'desc')->limit(5)->get(['id', 'title', 'slug', 'views_count', 'published_at']),
            'recent_comments' => BlogComment::with('post:id,title,slug')->latest()->limit(5)->get(),
        ]);
    }
}
