import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityLatchService {
  private platformId = inject(PLATFORM_ID);
  public isLocked$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated = false;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Disable DevTools security modal entirely on mobile devices
      if (window.innerWidth < 768) {
        return;
      }
      this.checkSession();
      this.startMonitoring();
    }
  }

  private checkSession() {
    this.isAuthenticated = sessionStorage.getItem('devtools_unlocked') === 'true';
  }

  private startMonitoring() {
    // Check every 1.5 seconds
    setInterval(() => {
      if (this.isAuthenticated) return;
      this.detectDevTools();
    }, 1500);
  }

  private detectDevTools() {
    if (this.isAuthenticated) return;

    // Timing check using debugger. 
    // This will only pause the app if DevTools is open.
    const start = performance.now();
    debugger;
    const end = performance.now();

    if (end - start > 100) {
      this.triggerLock();
      return; 
    }
    
    // Window size check (Docked DevTools)
    const threshold = 160;
    const widthDiff = window.outerWidth - window.innerWidth > threshold;
    const heightDiff = window.outerHeight - window.innerHeight > threshold;
    
    if (widthDiff || heightDiff) {
      this.triggerLock();
    }
  }

  /**
   * Public method to trigger the lock manually on keyboard shortcuts
   */
  public triggerLock() {
    if (!this.isAuthenticated) {
      this.isLocked$.next(true);
    }
  }

  public unlock(key: string): boolean {
    const AUTH_KEY = 'plag@321';
    if (key?.trim() === AUTH_KEY) {
      this.isAuthenticated = true;
      this.isLocked$.next(false);
      sessionStorage.setItem('devtools_unlocked', 'true');
      return true;
    }
    return false;
  }

  /**
   * Allows the user to manually dismiss the lock modal
   * without authenticating (temporarily hiding it).
   */
  public dismissLock() {
    this.isLocked$.next(false);
  }
}
