import { Component, AfterViewInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser, AsyncPipe, NgIf } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FooterComponent } from '../pages/footer/footer.component';
import { NavbarComponent } from '../pages/navbar/navbar.component';
import { SecurityLatchService } from '../Services/Security/security-latch.service';
import { CanonicalService } from './services/canonical/canonical.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, AsyncPipe, NgIf, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  isBrowser: boolean;

  /** Stream driving the overlay visibility */
  isLocked$: Observable<boolean>;

  /** Two-way bound to the password input */
  authKey = '';

  /** Shows "Invalid key" message after a failed attempt */
  showError = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    public securityService: SecurityLatchService,
    private titleService: Title,
    private metaService: Meta,
    private canonicalService: CanonicalService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.isLocked$ = this.securityService.isLocked$;

    // Set Root Canonical 
    if (this.isBrowser) {
      this.canonicalService.setRoot();
    }

    // Add Global SEO Tags
    this.titleService.setTitle('PlagiarismGuard - Advanced AI Plagiarism Detection');
    this.metaService.addTags([
      { name: 'description', content: 'Protect your content integrity with an advanced AI plagiarism detection neural pipeline.' },
      { name: 'keywords', content: 'plagiarism checker, AI detector, content verification, student tools' },
      { property: 'og:title', content: 'PlagiarismGuard - Advanced AI Plagiarism Detection' },
      { property: 'og:description', content: 'Protect your content integrity with an advanced AI plagiarism detection neural pipeline.' },
      { property: 'og:url', content: 'https://plagiarism-checker.dev/' },
      { property: 'og:type', content: 'website' }
    ]);

    if (this.isBrowser) {
      gsap.registerPlugin(ScrollTrigger);
      this.initScrollToTop();
    }
  }

  // ── DevTools keyboard shortcut blockers ──────────────────────────────────

  /** Block F12, Ctrl+Shift+I/J/C, Ctrl+U */
  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    // If already authenticated, allow all native browser behaviors
    if (this.securityService.isAuthenticated) return;

    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;

    const blocked =
      e.key === 'F12' ||
      (ctrl && shift && ['i', 'I', 'j', 'J', 'c', 'C'].includes(e.key)) ||
      (ctrl && ['u', 'U'].includes(e.key));

    if (blocked) {
      this.securityService.triggerLock();
      e.preventDefault();
      e.stopPropagation();
    }
  }

  /** Block right-click context menu */
  @HostListener('contextmenu', ['$event'])
  onContextMenu(e: MouseEvent): void {
    if (this.securityService.isAuthenticated) return;
    
    this.securityService.triggerLock();
    e.preventDefault();
  }

  // ── Unlock logic ──────────────────────────────────────────────────────────

  attemptUnlock(): void {
    const success = this.securityService.unlock(this.authKey.trim());
    if (!success) {
      this.showError = true;
      this.authKey = '';
      // Auto-hide error after 3 s
      setTimeout(() => (this.showError = false), 3000);
    } else {
      this.showError = false;
      this.authKey = '';
    }
  }

  dismissModal(): void {
    this.securityService.dismissLock();
    this.authKey = '';
    this.showError = false;
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  private initScrollToTop(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initGlobalAnimations();
      this.initCustomCursor();
    }
  }

  initGlobalAnimations(): void {
    gsap.from('body', { opacity: 0, duration: 0.6, ease: 'power2.out' });

    ScrollTrigger.batch('.glass-card, .advantage-card, .service-box, .info-card', {
      onEnter: (elements) => {
        gsap.from(elements, {
          y: 40, opacity: 0, duration: 0.8,
          stagger: 0.1, ease: 'power3.out', overwrite: true
        });
      },
      start: 'top 85%'
    });
  }

  initCustomCursor(): void {
    const cursor   = document.querySelector('.custom-cursor')   as HTMLElement;
    const follower = document.querySelector('.cursor-follower') as HTMLElement;
    if (!cursor || !follower) return;

    window.addEventListener('mousemove', (e) => {
      gsap.to(cursor,   { x: e.clientX,       y: e.clientY,       duration: 0.1 });
      gsap.to(follower, { x: e.clientX - 12,  y: e.clientY - 12,  duration: 0.3 });
    });

    const magneticEls = document.querySelectorAll('a, button, .btn-primary, .btn-secondary');
    magneticEls.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursor,   { scale: 3, opacity: 0.5, duration: 0.3 });
        gsap.to(follower, { scale: 1.5, borderColor: 'var(--primary)', duration: 0.3 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursor,   { scale: 1, opacity: 1, duration: 0.3 });
        gsap.to(follower, { scale: 1, borderColor: 'rgba(0,194,255,0.3)', duration: 0.3 });
        gsap.to(el,       { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
      });
      el.addEventListener('mousemove', (e: any) => {
        const rect = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - rect.left - rect.width  / 2) * 0.2,
          y: (e.clientY - rect.top  - rect.height / 2) * 0.2,
          duration: 0.4, ease: 'power2.out'
        });
      });
    });
  }
}
