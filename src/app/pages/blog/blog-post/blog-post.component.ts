import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { BlogService, BlogPost } from '../blog.service';
import { Subscription } from 'rxjs';
import { CanonicalService } from '../../../services/canonical/canonical.service';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.css'
})
export class BlogPostComponent implements OnInit, OnDestroy {
  post: BlogPost | undefined;
  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private titleService: Title,
    private metaService: Meta,
    private canonicalService: CanonicalService,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') || '';
      this.post = this.blogService.getPostBySlug(slug);
      if (this.post) {
        this.updateSEOMeta(this.post);
      }
    });
  }

  private updateSEOMeta(post: BlogPost): void {
    // Update page title
    this.titleService.setTitle(`${post.title} | PlagiarismGuard Blog`);

    // Update meta description
    this.metaService.updateTag({ name: 'description', content: post.metaDescription });

    // Update keywords
    this.metaService.updateTag({ name: 'keywords', content: post.keywords.join(', ') });

    // Update Open Graph tags
    this.metaService.updateTag({ property: 'og:title', content: post.title });
    this.metaService.updateTag({ property: 'og:description', content: post.metaDescription });
    this.metaService.updateTag({ property: 'og:type', content: 'article' });
    this.metaService.updateTag({ property: 'og:url', content: `https://plagiarism-checker.dev/blog/${post.slug}` });

    // Article-specific meta
    this.metaService.updateTag({ property: 'article:author', content: post.author });
    this.metaService.updateTag({ property: 'article:published_time', content: post.date });

    // Update canonical link
    if (isPlatformBrowser(this.platformId)) {
      this.canonicalService.setPath(`/blog/${post.slug}`);
    }
  }

  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
    // Restore canonical to root on leave
    if (isPlatformBrowser(this.platformId)) {
      this.canonicalService.setRoot();
    }
  }
}
