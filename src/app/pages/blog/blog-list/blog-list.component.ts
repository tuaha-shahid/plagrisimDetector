import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { BlogService, BlogPost } from '../blog.service';
import { CanonicalService } from '../../../services/canonical/canonical.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.css'
})
export class BlogListComponent implements OnInit {
  allPosts: BlogPost[] = [];
  featuredPost!: BlogPost;
  gridPosts: BlogPost[] = [];
  paginatedPosts: BlogPost[] = [];

  readonly PAGE_SIZE = 9;
  private currentPage = 1;
  hasMore = false;

  constructor(
    private blogService: BlogService,
    private titleService: Title,
    private metaService: Meta,
    private canonicalService: CanonicalService
  ) {}

  ngOnInit(): void {
    this.allPosts = this.blogService.getAllPosts();

    // Newest post (index 0) is the featured hero
    this.featuredPost = this.allPosts[0];

    // Remaining posts go into the paginated grid
    this.gridPosts = this.allPosts.slice(1);
    this.loadMore(true);

    this.canonicalService.setPath('/blog');

    this.titleService.setTitle('Blog & Resources | PlagiarismGuard AI');
    this.metaService.updateTag({ name: 'description', content: 'Explore expert articles on AI plagiarism detection, academic integrity, LLM content verification, and maintaining originality in the age of generative AI.' });
    this.metaService.updateTag({ property: 'og:title', content: 'Blog & Resources | PlagiarismGuard AI' });
    this.metaService.updateTag({ property: 'og:description', content: 'Expert guides on AI detection, academic integrity, and content originality.' });
  }

  loadMore(init = false): void {
    if (init) {
      this.currentPage = 1;
      this.paginatedPosts = [];
    }
    const start = (this.currentPage - 1) * this.PAGE_SIZE;
    const end = this.currentPage * this.PAGE_SIZE;
    this.paginatedPosts = [...this.paginatedPosts, ...this.gridPosts.slice(start, end)];
    this.hasMore = end < this.gridPosts.length;
    this.currentPage++;
  }

  /** Category background colour randomiser (deterministic by index) */
  getCategoryClass(category: string): string {
    const map: Record<string, string> = {
      'Technology': 'tag-tech',
      'Tech/Dev': 'tag-dev',
      'SEO': 'tag-seo',
      'AI Ethics': 'tag-ai',
      'Education': 'tag-edu',
      'Academic Integrity': 'tag-ai',
      'Academic Skills': 'tag-edu',
      'Legal': 'tag-legal',
      'Media Ethics': 'tag-media',
      'Business': 'tag-biz',
      'History/Ethics': 'tag-history',
      'Linguistics': 'tag-ling',
      'Future Tech': 'tag-future',
      'Content Ethics': 'tag-media',
    };
    return map[category] ?? 'tag-tech';
  }
}
