import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, APP_INITIALIZER, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { inject } from '@vercel/analytics';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { 
  LucideAngularModule, 
  ShieldCheck, 
  Twitter, 
  Github, 
  Linkedin, 
  GraduationCap, 
  Globe, 
  Cpu, 
  Check, 
  Target, 
  Database, 
  Upload, 
  Binary, 
  Search, 
  CheckSquare, 
  ArrowRight, 
  Shield, 
  CheckCircle, 
  Copy, 
  Download, 
  AlertTriangle, 
  ChevronRight, 
  Share2, 
  AlertCircle, 
  Trash2, 
  Zap, 
  BarChart3, 
  Mail, 
  Briefcase, 
  MapPin, 
  ChevronDown,
  Clock,
  FileText,
  UploadCloud
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      LucideAngularModule.pick({ 
        ShieldCheck, Twitter, Github, Linkedin, GraduationCap, Globe, Cpu, Check, 
        Target, Database, Upload, Binary, Search, CheckSquare, ArrowRight, Shield, 
        CheckCircle, Copy, Download, AlertTriangle, ChevronRight, Share2, 
        AlertCircle, Trash2, Zap, BarChart3, Mail, Briefcase, MapPin, ChevronDown, 
        Clock, FileText, UploadCloud 
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        return () => inject({ mode: isDevMode() ? 'development' : 'production' });
      },
      multi: true
    }
  ]
};
