import { Component, HostListener, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { gsap } from 'gsap';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink, 
    RouterLinkActive, 
    CommonModule, 
    LucideAngularModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements AfterViewInit {
  isMenuOpen = false;
  isScrolled = false;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.initAnimations();
    }
  }

  initAnimations() {
    // Use CSS animation class instead of GSAP so the navbar never
    // gets stuck in an intermediate state on page transitions.
    const navbar = document.querySelector('.navbar-app') as HTMLElement;
    if (navbar) {
      navbar.classList.add('navbar-animated');
    }
  }

  onHoverDropdown(event: MouseEvent) {
    if (!this.isBrowser) return;
    const dropdown = (event.currentTarget as HTMLElement).querySelector('.mega-dropdown');
    if (dropdown) {
      gsap.fromTo(dropdown, 
        { opacity: 0, y: 10, scale: 0.97, visibility: 'hidden' },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          visibility: 'visible',
          duration: 0.3, 
          ease: "power2.out",
          overwrite: true 
        }
      );
    }
  }

  onLeaveDropdown(event: MouseEvent) {
    if (!this.isBrowser) return;
    const dropdown = (event.currentTarget as HTMLElement).querySelector('.mega-dropdown');
    if (dropdown) {
      gsap.to(dropdown, {
        opacity: 0,
        y: 10,
        scale: 0.97,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(dropdown, { visibility: 'hidden' });
        },
        overwrite: true
      });
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
