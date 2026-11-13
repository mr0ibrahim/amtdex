import { Link } from "react-router-dom"
import { Icon } from "@/components/ui/Icon"
import { BrandArtwork } from "@/components/ui/BrandArtwork"
import { highlightMatch } from "@/search/arabic"
import { getBlogUrl, isBlogSubdomain } from "@/lib/subdomain"
import type { BlogPost } from "@/types/blog"

export function BlogArticleCard({ post, query = "" }: { post: BlogPost; query?: string }) {
  const href = isBlogSubdomain() ? `/posts/${post.slug}` : getBlogUrl(`/posts/${post.slug}`)
  const date = post.published_at ? new Date(post.published_at) : null
  const minutes = post.reading_time_minutes || post.reading_time
  return (
    <article className="blog-article-card" data-motion="rise">
      <Link to={href} className="blog-article-cover" aria-label={`اقرأ ${post.title}`} tabIndex={-1}>
        {post.cover_image ? <img src={post.cover_image} alt={post.cover_image_alt || post.title} loading="lazy" decoding="async" width={640} height={400} /> : <BrandArtwork kind="web" />}
        {post.category && <span className="blog-article-category">{post.category.name}</span>}
        <span className="blog-cover-arrow" aria-hidden="true"><Icon name="arrowUpLeft" size={19} /></span>
      </Link>
      <div className="blog-article-copy">
        <div className="blog-article-meta">
          {date && !Number.isNaN(date.getTime()) && <time dateTime={post.published_at!}>{date.toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" })}</time>}
          {minutes ? <span><Icon name="clock" size={13} /> {minutes} دقائق قراءة</span> : null}
        </div>
        <h3><Link to={href}>{highlightMatch(post.title, query)}</Link></h3>
        {post.summary && <p>{highlightMatch(post.summary, query)}</p>}
      </div>
      <div className="blog-article-footer">
        <span className="blog-article-author">{post.author?.avatar && <img src={post.author.avatar} alt="" loading="lazy" width={28} height={28} />}{post.author?.name || "مقال تقني"}</span>
        <Link to={href} aria-label={`قراءة المقال: ${post.title}`}>اقرأ المقال <Icon name="arrowUpLeft" size={16} /></Link>
      </div>
    </article>
  )
}
