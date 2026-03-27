import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { BlogService, BlogPost } from '../blog/blog.service';
import { CanonicalService } from '../../services/canonical/canonical.service';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css'
})
export class ResourcesComponent implements OnInit {
  allPosts: BlogPost[] = [];

  readonly categories: string[] = [];
  selectedCategory = 'All';
  get filteredPosts(): BlogPost[] {
    if (this.selectedCategory === 'All') return this.allPosts;
    return this.allPosts.filter(p => p.category === this.selectedCategory);
  }

  constructor(
    private blogService: BlogService,
    private titleService: Title,
    private metaService: Meta,
    private canonicalService: CanonicalService
  ) {}

  ngOnInit(): void {
    this.allPosts = this.blogService.getAllPosts();
    // Build unique, sorted category list
    const cats = [...new Set(this.allPosts.map(p => p.category))].sort();
    (this.categories as string[]).push(...cats);

    this.titleService.setTitle('Resources & Guides | PlagiarismGuard AI');
    this.metaService.updateTag({
      name: 'description',
      content: 'Browse all expert guides, tutorials, and research articles on AI plagiarism detection, SEO content integrity, academic integrity, and more.'
    });
    this.canonicalService.setPath('/resources');
  }

  selectCategory(cat: string): void {
    this.selectedCategory = cat;
  }
}
