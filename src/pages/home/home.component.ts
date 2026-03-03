import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PlagService } from '../../Services/Plagrisim/plag.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlagiarismCheckResult } from '../../Types/plag';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ ReactiveFormsModule, FormsModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  form: FormGroup;
  plagResult?: PlagiarismCheckResult;
  displayedPlagPercent = 0;
  displayedUniqPercent = 0;
  displayPhrasPercent=0;
  isLoading =  false;

  plagrsimService = inject(PlagService);
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private fb: FormBuilder) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.form = this.fb.group({
      plagContent: ['', Validators.compose([Validators.required, Validators.maxLength(999)])]
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Safe to use window object here
    }
  }
  getLength() {

    var content = this.form.value.plagContent.length; // Accessing the field value
    if(content>=999){
      return true
    }
    return false; // Ensure it handles empty/null values
  }
  sanitizeInput(input: string): string {
    const sanitized = input.replace(/[&<>"'\\]/g, (char) => {
      switch (char) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '"':
          return '&quot;';
        case "'":
          return '&#x27;';
        case '\\':
          return '&#x5c;';
        default:
          return char;
      }
    });
    return sanitized;
  }

  // this.form.value.plagContent
  checkPlagirism() {
    // console.log('Form Data (before sanitization):', this.form.value);

    // Sanitize the input
    const sanitizedContent = this.sanitizeInput(this.form.value.plagContent);
    // console.log(this.form.value.plagContent.length);
    const sanitizedFormValue = { ...this.form.value, plagContent: sanitizedContent };

    // console.log('Form Data (after sanitization):', sanitizedFormValue);

    this.isLoading = true;
    this.plagResult = undefined;

    this.plagrsimService.checkPlagrisim(sanitizedFormValue).subscribe(
      (result: PlagiarismCheckResult) => {
        this.plagResult = result;
        // console.log('Plagiarism Check Result:', result );
        // console.log('Plagiarism Check Result:', this.plagResult );

        this.isLoading = false;
        this.animateCount();
      },
      (error) => {
        console.error('Error fetching plagiarism check result:', error);
        this.isLoading = false;
      }
    );
  }

  animateCount() {
    const target = this.plagResult?.plagPercent || 0;
    const target1 = this.plagResult?.uniquePercent || 0;
    const target2 = this.plagResult?.paraphrasePercent || 0;
    const duration = 4000;
    const interval = 30;

    let startTime = Date.now();
    this.displayedPlagPercent = 0;

    const updateCount = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      this.displayedPlagPercent = Math.floor(progress * target);
      this.displayedUniqPercent = Math.floor(progress * target1);
      this.displayPhrasPercent = Math.floor(progress * target2);



      if (progress < 1) {
        setTimeout(updateCount, interval);
      }
    };

    updateCount();
  }


}
