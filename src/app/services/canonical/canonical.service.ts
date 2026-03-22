import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * CanonicalService
 * ─────────────────────────────────────────────────────────────
 * Creates, updates, or removes the <link rel="canonical"> tag
 * in the document <head>. Designed to be called from any
 * routed component's ngOnInit / ngOnDestroy lifecycle hooks.
 *
 * Usage:
 *   this.canonicalService.setUrl('https://plagiarism-checker.dev/blog/my-slug');
 *   this.canonicalService.setRoot();   // restores homepage canonical
 *   this.canonicalService.remove();    // strips the tag entirely
 */
@Injectable({ providedIn: 'root' })
export class CanonicalService {

  private readonly BASE = 'https://plagiarism-checker.dev';

  constructor(@Inject(DOCUMENT) private doc: Document) {}

  /** Set the canonical URL to an exact, full URL. */
  setUrl(url: string): void {
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
    const existing = this.doc.head.querySelector('link[rel="canonical"]');
    if (existing) {
      this.doc.head.removeChild(existing);
    }
  }

  // ── private helpers ──────────────────────────────────────────

  /** Returns the existing canonical link element, or creates one. */
  private getOrCreate(): HTMLLinkElement {
    let el = this.doc.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!el) {
      el = this.doc.createElement('link') as HTMLLinkElement;
      el.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(el);
    }
    return el;
  }
}
