import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements AfterViewInit {
  isBrowser: boolean;

  stats = [
    { label: 'Documents Verified', value: '276,540+' },
    { label: 'Sources Indexed', value: '1B+' },
    { label: 'Accuracy Rate', value: '99.4%' }
  ];

  steps = [
    { title: 'Secure Upload', desc: 'Enterprise-grade encryption for every document upload.', icon: 'upload-cloud' },
    { title: 'AI Analysis', desc: 'Predictive neural scanning across linguistic patterns.', icon: 'cpu' },
    { title: 'Wide Search', desc: 'Real-time comparison with billions of live web sources.', icon: 'globe' },
    { title: 'Result Ops', desc: 'Downloadable detailed reports with similarity maps.', icon: 'search' }
  ];

  team = [
    { name: 'Dr. Alex Chen', role: 'Chief AI Officer', image: 'https://i.pravatar.cc/300?u=alex' },
    { name: 'Sarah Miller', role: 'Head of Research', image: 'https://i.pravatar.cc/300?u=sarah' },
    { name: 'James Wilson', role: 'Lead Developer', image: 'https://i.pravatar.cc/300?u=james' },
    { name: 'Elena Rodriguez', role: 'Ethics Lead', image: 'https://i.pravatar.cc/300?u=elena' }
  ];

  @ViewChild('heroTitle') heroTitleRef!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.initHeroAnimations();
      this.initFloatingOrb();
      this.initProcessAnimations();
      this.initParallax();
      this.initStatsCounter();
    }
  }

  private initHeroAnimations() {
    const title = this.heroTitleRef.nativeElement;
    const words = title.innerText.split(' ');
    title.innerHTML = words.map((w: string) => `<span class="word">${w}</span>`).join(' ');

    gsap.from('.hero-title .word', {
      y: 40,
      opacity: 0,
      stagger: 0.08,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.mission-quote-card', {
      opacity: 0,
      x: -30,
      duration: 1.2,
      delay: 0.5,
      ease: 'power2.out'
    });
  }

  private initFloatingOrb() {
    gsap.to('.floating-orb', {
      x: 'random(-50, 50)',
      y: 'random(-50, 50)',
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  private initProcessAnimations() {
    gsap.from('.process-step-card', {
      scrollTrigger: {
        trigger: '.process-grid-wrapper',
        start: 'top 95%'
      },
      y: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: 'power2.out',
      clearProps: 'opacity,transform'
    });
  }

  private initParallax() {
    gsap.to('.parallax-text', {
      scrollTrigger: {
        trigger: '.parallax-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: -50
    });

    gsap.to('.parallax-grid', {
      scrollTrigger: {
        trigger: '.parallax-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      },
      y: 30
    });
  }

  private initStatsCounter() {
    // Stats are now pre-formatted strings — no animation needed
    // Values display directly from the template binding
  }
}
