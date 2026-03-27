import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { CanonicalService } from '../../services/canonical/canonical.service';
import { LANDING_PAGES, LandingPageConfig } from './landing-pages.data';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {
  page!: LandingPageConfig;

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    private canonicalService: CanonicalService
  ) {}

  ngOnInit(): void {
    // Derive which page to show from the route path
    const path = this.route.snapshot.url[0]?.path ?? '';
    const found = LANDING_PAGES.find(p => p.path === path);
    this.page = found ?? LANDING_PAGES[0];

    this.titleService.setTitle(this.page.metaTitle);
    this.metaService.updateTag({ name: 'description', content: this.page.metaDescription });
    this.metaService.updateTag({ name: 'keywords', content: this.page.tier1Keywords.join(', ') });
    this.metaService.updateTag({ property: 'og:title', content: this.page.metaTitle });
    this.metaService.updateTag({ property: 'og:description', content: this.page.metaDescription });
    this.metaService.updateTag({ property: 'og:url', content: `https://plagiarism-checker.dev/${this.page.path}` });
    this.canonicalService.setPath(`/${this.page.path}`);
  }
}
