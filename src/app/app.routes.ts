import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { AboutComponent } from '../pages/about/about.component';
import { ServicesComponent } from '../pages/services/services.component';
import { WhyUsComponent } from '../pages/why-us/why-us.component';
import { ContactComponent } from '../pages/contact/contact.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';

export const routes: Routes = [
    {
        path:'',
        title:'PlagiarismGuard - Free AI Plagiarism Checker',
        component:HomeComponent
    },
    {
        path:'home',
        component:HomeComponent,
        title:'PlagiarismGuard - Free AI Plagiarism Checker'
    },
    {
        path:'about',
        component:AboutComponent,
        title:'About Us | PlagiarismGuard'
    },
    {
        path:'services',
        component:ServicesComponent,
        title:'Pricing & Plans | PlagiarismGuard'
    },
    {
        path:'why-us',
        component:WhyUsComponent,
        title:'Why Choose PlagiarismGuard | AI Detection'
    },
    {
        path:'contact',
        component:ContactComponent,
        title:'Contact Us | PlagiarismGuard'
    },
    {
        path:'privacy',
        component:PrivacyComponent,
        title:'Privacy Policy | PlagiarismGuard'
    },
    {
        path:'terms',
        component:TermsComponent,
        title:'Terms of Service | PlagiarismGuard'
    },
    {
        path:'blog',
        loadComponent: () => import('./pages/blog/blog-list/blog-list.component').then(m => m.BlogListComponent),
        title: 'Blog & Resources | PlagiarismGuard AI'
    },
    {
        path:'blog/:slug',
        loadComponent: () => import('./pages/blog/blog-post/blog-post.component').then(m => m.BlogPostComponent),
        title: 'Blog | PlagiarismGuard AI'
    },
    {
        path: '**',
        redirectTo: ''
    }
];

