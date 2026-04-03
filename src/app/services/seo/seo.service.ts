import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SeoService {

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  /**
   * Call once from AppComponent constructor.
   * Automatically reads `data.metaDescription` from every route definition
   * and updates <meta name="description"> on each NavigationEnd.
   */
  listenToRouteChanges(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      if (data['metaDescription']) {
        this.updateMeta(data['metaDescription']);
      }
    });
  }

  /**
   * Manually set all SEO fields for a specific page (call from any component).
   * Used by BlogPostComponent to set post-specific meta.
   */
  updateAll(options: {
    title: string;
    description: string;
    url?: string;
    imageUrl?: string;
  }): void {
    this.titleService.setTitle(options.title);
    this.updateMeta(options.description);

    this.metaService.updateTag({ property: 'og:title', content: options.title });
    this.metaService.updateTag({ property: 'og:description', content: options.description });

    if (options.url) {
      this.metaService.updateTag({ property: 'og:url', content: options.url });
    }
    if (options.imageUrl) {
      this.metaService.updateTag({ property: 'og:image', content: options.imageUrl });
    }
    // Twitter cards
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: options.title });
    this.metaService.updateTag({ name: 'twitter:description', content: options.description });
  }

  /** Updates only the meta description tag */
  updateMeta(description: string): void {
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:description', content: description });
  }
}
