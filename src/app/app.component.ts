import { Component, AfterViewInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FooterComponent } from '../pages/footer/footer.component';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NavbarComponent } from '../pages/navbar/navbar.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet ,NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      gsap.registerPlugin(ScrollTrigger);
      this.initScrollToTop();
    }
  }

  private initScrollToTop() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.initGlobalAnimations();
      this.initCustomCursor();
    }
  }

  initGlobalAnimations() {
    // Page Entrance
    gsap.from('body', {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    });

    // Staggered reveals for cards and headings globally
    ScrollTrigger.batch('.glass-card, .advantage-card, .service-box, .info-card', {
      onEnter: (elements) => {
        gsap.from(elements, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          overwrite: true
        });
      },
      start: 'top 85%'
    });
  }

  initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;
    const follower = document.querySelector('.cursor-follower') as HTMLElement;
    
    if (!cursor || !follower) return;

    window.addEventListener('mousemove', (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
      });
      gsap.to(follower, {
        x: e.clientX - 12,
        y: e.clientY - 12,
        duration: 0.3
      });
    });

    // Magnetic effect on buttons
    const magneticElements = document.querySelectorAll('a, button, .btn-primary, .btn-secondary');
    magneticElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 3, opacity: 0.5, duration: 0.3 });
        gsap.to(follower, { scale: 1.5, borderColor: 'var(--primary)', duration: 0.3 });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
        gsap.to(follower, { scale: 1, borderColor: 'rgba(0, 194, 255, 0.3)', duration: 0.3 });
      });

      el.addEventListener('mousemove', (e: any) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(el, {
          x: x * 0.2,
          y: y * 0.2,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
      });
    });
  }
}
