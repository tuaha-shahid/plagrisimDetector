import { Component, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PlagService } from '../../Services/Plagrisim/plag.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlagiarismCheckResult } from '../../Types/plag';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ 
    ReactiveFormsModule, 
    FormsModule, 
    CommonModule, 
    LucideAngularModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('particleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('heroTitle') heroTitleRef!: ElementRef;
  @ViewChild('inputCard') inputCard!: ElementRef;
  
  form: FormGroup;
  plagResult?: PlagiarismCheckResult;
  displayedUsers = 0;
  
  normOriginal = 0;
  normMatched = 0;
  
  isLoading = false;
  isBrowser: boolean;
  isDragging = false;
  
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId!: number;

  // Scanner Display Logic
  loaderMessages = [
    "Initializing neural engines...",
    "Scanning 1B+ scholarly articles...",
    "Cross-referencing web sources...",
    "Analyzing semantic structures...",
    "Finalizing originality report..."
  ];
  currentLoaderMessage = this.loaderMessages[0];
  private loaderInterval?: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private plagrimService: PlagService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.form = this.fb.group({
      plagContent: ['', Validators.compose([Validators.required, Validators.maxLength(5000)])]
    });

    if (this.isBrowser) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.initParticles();
      this.initPageAnimations();
      this.animateUsersCounter();
      
      window.addEventListener('resize', () => this.resizeCanvas());
    }
  }

  // --- Canvas Particle Logic ---
  private initParticles() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();

    // 80 small dots as requested
    for (let i = 0; i < 80; i++) {
      this.particles.push(new Particle(canvas.width, canvas.height));
    }
    
    // Using GSAP ticker for smoother rendering as requested
    gsap.ticker.add(() => this.animateParticles());
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.85;
  }

  private animateParticles() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    
    this.particles.forEach((p, i) => {
      p.update(this.ctx.canvas.width, this.ctx.canvas.height);
      p.draw(this.ctx);

      // Connect lines within 120px as requested
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          this.ctx.beginPath();
          // Opacity based on distance
          const opacity = 0.5 * (1 - dist / 120);
          this.ctx.strokeStyle = `rgba(0, 194, 255, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    });
  }

  // --- GSAP Animations ---
  private initPageAnimations() {
    try {
      const tl = gsap.timeline({
        onComplete: () => {
          // Force all hero elements to final visible state when animation completes
          gsap.set('.hero-title, .hero-sub, .hero-btns', { opacity: 1, visibility: 'visible', clearProps: 'transform' });
          // Ensure input card is visible
          gsap.set('.input-section-card', { opacity: 1, visibility: 'visible', clearProps: 'transform' });
        }
      });
      
      // Floating animations for badges
      gsap.to([".badge-1", ".badge-4", ".badge-5"], { y: -10, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".badge-2", { y: -8, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 });
      gsap.to(".badge-3", { y: -12, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.5 });

      tl.from('.hero-title', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2
      })
      .from('.hero-sub', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.4')
      .from('.hero-btns', {
        y: 20,
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: "back.out(1.2)"
      }, '-=0.3');
      // NOTE: .input-section-card is intentionally NOT animated.
      // GSAP 'from' sets opacity:0 inline — scroll before animation = invisible card.
      // The card uses CSS for its initial appearance instead.

      // ScrollTrigger for CTA
      gsap.from('.cta-banner', {
        scrollTrigger: {
          trigger: '.cta-banner',
          start: 'top 90%',
        },
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        clearProps: 'all'
      });
    } catch (e) {
      console.warn('GSAP Home Animation Failed:', e);
      // Fallback: make everything visible if GSAP fails
      const elements = document.querySelectorAll('.hero-title, .hero-sub, .hero-btns, .trusted-badge, .input-section-card, .floating-badge');
      elements.forEach(el => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.visibility = 'visible';
        (el as HTMLElement).style.transform = 'none';
      });
    }
  }

  private animateUsersCounter() {
    gsap.to(this, {
      displayedUsers: 276,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        this.displayedUsers = Math.floor(this.displayedUsers);
      }
    });
  }

  // --- Logic Helpers ---
  get charCount() {
    return this.form.get('plagContent')?.value?.length || 0;
  }

  get wordCount(): number {
    const text = this.form.get('plagContent')?.value || '';
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileUpload(files[0]);
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFileUpload(file);
    }
  }

  async handleFileUpload(file: File) {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
       try {
         // Dynamically import to avoid SSR errors (DOMMatrix is not defined on server)
         const pdfjsLib = await import('pdfjs-dist');
         pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

         const arrayBuffer = await file.arrayBuffer();
         const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
         let fullText = '';
         for (let i = 1; i <= pdf.numPages; i++) {
           const page = await pdf.getPage(i);
           const textContent = await page.getTextContent();
           const pageText = textContent.items.map((item: any) => item.str).join(' ');
           fullText += pageText + '\n\n';
         }
         this.form.patchValue({ plagContent: fullText.trim() });
       } catch (error) {
         console.error('Error reading PDF:', error);
         alert('Failed to read PDF file.');
       }
    } else if (extension === 'doc' || extension === 'docx') {
       try {
         const mammoth = await import('mammoth');
         const arrayBuffer = await file.arrayBuffer();
         const result = await mammoth.extractRawText({ arrayBuffer });
         this.form.patchValue({ plagContent: result.value.trim() });
       } catch (error) {
         console.error('Error reading Word doc:', error);
         alert('Failed to read Word document.');
       }
    } else {
       // Fallback for TXT or other text-based files
       const reader = new FileReader();
       reader.onload = (e: any) => {
         this.form.patchValue({ plagContent: e.target.result });
       };
       reader.readAsText(file);
    }
  }

  private hasAnimated = false;
  
  checkPlagiarism() {
    if (this.form.invalid) return;
    this.isLoading = true;
    this.hasAnimated = false;
    
    // Start loader message rotation
    let msgIndex = 0;
    this.currentLoaderMessage = this.loaderMessages[0];
    this.loaderInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % this.loaderMessages.length;
      this.currentLoaderMessage = this.loaderMessages[msgIndex];
    }, 1500);
    
    this.plagrimService.checkPlagrisim(this.form.value).subscribe({
      next: (result) => {
        clearInterval(this.loaderInterval);
        this.plagResult = result;
        this.isLoading = false;
        setTimeout(() => this.animateResults(), 100);
      },
      error: () => {
        clearInterval(this.loaderInterval);
        this.isLoading = false;
        alert('An error occurred during the scan. Please try again.');
      }
    });
  }

  private animateResults() {
    if (this.hasAnimated || !this.isBrowser || !this.plagResult) return;
    this.hasAnimated = true;

    // Use the real API values directly — unique + plagiarism = 100%
    this.normOriginal = this.plagResult.score?.unique ?? 0;
    this.normMatched = this.plagResult.score?.plagiarism ?? 0;

    const trustScore = this.normOriginal;
    
    // Animate Circular Progress Ring
    const circumference = 502; // 2 * PI * 80
    const offset = circumference - (trustScore / 100) * circumference;
    
    gsap.to('.progress-ring-circle', {
      strokeDashoffset: offset,
      duration: 1.8,
      ease: 'power2.out'
    });

    // Score Bars Animation
    gsap.to('.score-bar-fill', {
      width: (index: number, target: HTMLElement) => {
        const id = target.id;
        if (id === 'bar-original') return this.normOriginal + '%';
        if (id === 'bar-matched') return this.normMatched + '%';
        return '0%';
      },
      duration: 1.5,
      stagger: 0.2,
      ease: 'power2.out'
    });

    gsap.from('.result-card-animate', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  }

  get highlightedText(): SafeHtml {
    if (!this.plagResult || !this.form.value.plagContent) {
      return this.sanitizer.bypassSecurityTrustHtml(this.form.value.plagContent || '');
    }

    let text: string = this.form.value.plagContent;
    const matches = this.plagResult.matches || [];
    const sentences = matches.map(m => m.sentence).filter((v, i, a) => a.indexOf(v) === i);
    
    sentences.forEach(sentence => {
      if (!sentence) return;
      const matchObj = matches.find(m => m.sentence === sentence);
      const escapedSentence = sentence.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(${escapedSentence})`, 'gi');
      text = text.replace(regex, `<span class="highlight-plag" title="Source: ${matchObj?.source}">$1</span>`);
    });

    text = text.replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }

  getSourceMatchPercent(percentage: any): number {
    return typeof percentage === 'number' ? percentage : parseInt(percentage || '0');
  }

  getTrustScore(sourceUrl: string): number {
    return 85 + Math.floor(Math.random() * 10);
  }

  clearText() {
    this.form.reset();
    this.plagResult = undefined;
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  scrollToInput() {
    this.inputCard.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number = 1.5; // Radius 1.5px as requested

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 194, 255, 0.5)'; // Color as requested
    ctx.fill();
  }
}
