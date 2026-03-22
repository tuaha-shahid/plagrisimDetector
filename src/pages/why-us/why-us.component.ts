import { Component, AfterViewInit, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-why-us',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule,
    RouterLink
  ],
  templateUrl: './why-us.component.html',
  styleUrls: ['./why-us.component.css']
})
export class WhyUsComponent implements AfterViewInit {
  isBrowser: boolean;

  advantages = [
    { title: '99.9% Accuracy', desc: 'Highest precision for both AI and human-written content.', icon: 'target' },
    { title: 'Neural Detection', desc: 'Identifies patterns from GPT-4, Claude, and Gemini.', icon: 'cpu' },
    { title: 'Global Database', desc: 'Cross-records from billions of web and academic sources.', icon: 'database' }
  ];

  pipeline = [
    { step: 'Text Ingestion', desc: 'Securely upload into our encrypted portal.', icon: 'upload' },
    { step: 'Semantic Parsing', desc: 'AI breaks down text context and intent.', icon: 'binary' },
    { step: 'Global Search', desc: 'Parallel scanning across billions of sources.', icon: 'search' },
    { step: 'Verification', desc: 'Final check for AI signatures.', icon: 'check-square' }
  ];

  testimonials = [
    { name: 'Dr. Emily Watson', role: 'UNIVERSITY DEAN', text: 'Plagiarism Guard has revolutionized how we maintain academic integrity. The AI detection is incredibly precise.' },
    { name: 'Mark Stevens', role: 'CONTENT STRATEGIST', text: 'The speed is unmatched. I can scan entire content buckets in minutes instead of hours.' }
  ];

  @ViewChild('heroTitle') heroTitleRef!: ElementRef;
  @ViewChild('ctaArrow', { read: ElementRef }) ctaArrowRef!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.initHeroAnimations();
      this.initCommonAnimations();
    }
  }

  private initHeroAnimations() {
    const title = this.heroTitleRef.nativeElement;
    const words = title.innerText.split(' ');
    title.innerHTML = words.map((w: string) => `<span class="word">${w}</span>`).join(' ');

    gsap.from('.hero-title .word', {
      y: 50,
      opacity: 0,
      rotationX: 30,
      stagger: 0.1,
      duration: 1.2,
      ease: 'power4.out',
      transformOrigin: "0% 50% -50"
    });
  }

  private initCommonAnimations() {
    // Arrow Interaction
    const arrow = this.ctaArrowRef.nativeElement;
    const btn = arrow.closest('button');
    btn?.addEventListener('mouseenter', () => gsap.to(arrow, { x: 6, duration: 0.3, ease: 'power2.out' }));
    btn?.addEventListener('mouseleave', () => gsap.to(arrow, { x: 0, duration: 0.3, ease: 'power2.out' }));
  }
}
