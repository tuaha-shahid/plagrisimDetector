import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';


// 1. Add this import at the top
import { inject } from '@vercel/analytics';

// 2. Call the inject function to start tracking
inject();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
