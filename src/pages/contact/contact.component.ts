import { Component, AfterViewInit, Inject, PLATFORM_ID, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    LucideAngularModule
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements AfterViewInit {
  isBrowser: boolean;
  contactForm: FormGroup;
  isSubmitting = false;
  
  faqs = [
    {
      question: 'How accurate is the plagiarism detection?',
      answer: 'Our system boasts a 99.9% accuracy rate, leveraging advanced semantic analysis to detect both direct copies and AI-paraphrased content across billions of sources.',
      open: false
    },
    {
      question: 'What file formats are supported?',
      answer: 'We support all major document formats including .docx, .pdf, .txt, and .rtf, as well as direct text pasting for instant analysis.',
      open: false
    },
    {
      question: 'How long does a deep scan take?',
      answer: 'Most scans are completed within 15-30 seconds. Extremely large documents (50+ pages) may take up to 60 seconds for a full comprehensive check.',
      open: false
    },
    {
      question: 'Is my content stored after scanning?',
      answer: 'Security is our priority. Your content is processed in an encrypted environment and is never stored in any public repository or used to train our models without explicit permission.',
      open: false
    }
  ];

  @ViewChild('heroTitle') heroTitleRef!: ElementRef;
  @ViewChildren('faqBody') faqBodies!: QueryList<ElementRef>;
  @ViewChildren('faqArrow', { read: ElementRef }) faqArrows!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.contactForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      gsap.registerPlugin(ScrollTrigger);
      this.initHeroAnimations();
      this.initFormAnimations();
      this.initCardAnimations();
    }
  }

  private initHeroAnimations() {
    const title = this.heroTitleRef.nativeElement;
    const text = title.innerText;
    title.innerHTML = text.split('').map((c: string) => `<span class="char">${c === ' ' ? '&nbsp;' : c}</span>`).join('');

    gsap.from('.hero-title .char', {
      y: 40,
      opacity: 0,
      stagger: 0.04,
      duration: 0.8,
      ease: 'back.out(2)'
    });

    gsap.from('.hero-subtitle', {
      filter: 'blur(10px)',
      opacity: 0,
      y: 20,
      duration: 1.2,
      delay: 0.5,
      ease: 'power3.out'
    });
  }

  private initFormAnimations() {
    gsap.from('.floating-group', {
      scrollTrigger: {
        trigger: '.advanced-contact-form',
        start: 'top 75%'
      },
      x: -30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out'
    });
  }

  private initCardAnimations() {
    gsap.from('.info-card-premium', {
      scrollTrigger: {
        trigger: '.info-card-premium',
        start: 'top 85%'
      },
      y: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: 'power3.out'
    });

    // Icon rotation on hover
    const cards = document.querySelectorAll('.info-card-premium');
    cards.forEach(card => {
      const icon = card.querySelector('.info-icon-circle');
      card.addEventListener('mouseenter', () => gsap.to(icon, { rotate: 15, duration: 0.3 }));
      card.addEventListener('mouseleave', () => gsap.to(icon, { rotate: 0, duration: 0.3 }));
    });
  }

  toggleFaq(index: number) {
    if (!this.isBrowser) return;
    
    const bodies = this.faqBodies.toArray();
    const arrows = this.faqArrows.toArray();
    
    const targetFaq = this.faqs[index];
    const targetBody = bodies[index].nativeElement;
    const targetArrow = arrows[index].nativeElement;

    // Close all other open FAQs
    this.faqs.forEach((faq, i) => {
      if (i !== index && faq.open) {
        faq.open = false;
        gsap.to(bodies[i].nativeElement, { height: 0, duration: 0.3, ease: 'power2.in' });
        gsap.to(arrows[i].nativeElement, { rotate: 0, duration: 0.2 });
      }
    });

    // Toggle the current one
    targetFaq.open = !targetFaq.open;

    if (targetFaq.open) {
      gsap.to(targetBody, { height: 'auto', duration: 0.4, ease: 'power2.out' });
      gsap.to(targetArrow, { rotate: 180, duration: 0.3 });
    } else {
      gsap.to(targetBody, { height: 0, duration: 0.4, ease: 'power2.in' });
      gsap.to(targetArrow, { rotate: 0, duration: 0.3 });
    }
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        alert('Transmission Encrypted & Sent Successfully!');
        this.contactForm.reset();
      }, 2000);
    }
  }
}
