import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CanonicalService {

  private readonly BASE = 'https://plagiarism-checker.dev';
  private isBrowser: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /** Set the canonical URL to an exact, full URL. */
  setUrl(url: string): void {
    if (!this.isBrowser) return; // SSR Safety
    
    this.getOrCreate().setAttribute('href', url);
  }

  /** Convenience: set canonical to the root domain. */
  setRoot(): void {
    this.setUrl(`${this.BASE}/`);
  }

  /**
   * Build a canonical URL from a path segment.
   * E.g. setPath('/blog/my-slug') → https://plagiarism-checker.dev/blog/my-slug
   */
  setPath(path: string): void {
    const clean = path.startsWith('/') ? path : `/${path}`;
    this.setUrl(`${this.BASE}${clean}`);
  }

  /** Remove the canonical tag from the document head entirely. */
  remove(): void {
    if (!this.isBrowser) return; // SSR Safety
    
    const existing = this.document.head?.querySelector('link[rel="canonical"]');
    if (existing) {
      this.document.head.removeChild(existing);
    }
  }

  // ── private helpers ──────────────────────────────────────────

  /** Returns the existing canonical link element, or creates one. */
  private getOrCreate(): HTMLLinkElement {
    let el = this.document.head?.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!el) {
      el = this.document.createElement('link') as HTMLLinkElement;
      el.setAttribute('rel', 'canonical');
      if (this.document.head) {
        this.document.head.appendChild(el);
      }
    }
    return el;
  }
}
