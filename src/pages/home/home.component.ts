import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PlagService } from '../../Services/Plagrisim/plag.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlagiarismCheckResult } from '../../Types/plag';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RoughNotationModule } from 'ng-rough-notation';
import { Inject, PLATFORM_ID } from '@angular/core';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ReactiveFormsModule, FormsModule,CommonModule,RoughNotationModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  form: FormGroup;
  plagResult?: PlagiarismCheckResult;
  displayedPlagPercent = 0;
  displayedUniqPercent = 0;
  displayPhrasPercent=0;
  isLoading = false;  

  plagrsimService = inject(PlagService);
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private fb: FormBuilder) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.form = this.fb.group({
      plagContent: ['', Validators.required]
    });
  }
  
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Safe to use window object here
    }
  }
   

  checkPlagirism() {
    console.log('Form Data:', this.form.value);  // Log form data
    this.isLoading = true;  // Start loading
    this.plagResult = undefined;  // Clear previous results

    this.plagrsimService.checkPlagrisim(this.form.value).subscribe(
      (result: PlagiarismCheckResult) => {
        this.plagResult = result;
        console.log('Plagiarism Check Result:', result);  // Log result here
        this.isLoading = false;  // Stop loading
        this.animateCount();
      },
      (error) => {
        console.error('Error fetching plagiarism check result:', error);
        this.isLoading = false;  // Stop loading in case of error
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
