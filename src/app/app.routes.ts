import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { AboutComponent } from '../pages/about/about.component';
import { ServicesComponent } from '../pages/services/services.component';
import { WhyUsComponent } from '../pages/why-us/why-us.component';
import { ContactComponent } from '../pages/contact/contact.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    {
        path: '',
        title: 'PlagiarismGuard - Free AI Plagiarism Checker',
        component: HomeComponent,
        data: { metaDescription: 'Free AI plagiarism checker — detect AI-generated content and copied text across billions of academic and web sources instantly.' }
    },
    {
        path: 'home',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: 'about',
        component: AboutComponent,
        title: 'About Us | PlagiarismGuard',
        data: { metaDescription: 'Learn about the PlagiarismGuard team, our multi-layer AI detection technology, and our mission to protect academic and content integrity.' }
    },
    {
        path: 'services',
        component: ServicesComponent,
        title: 'Pricing & Plans | PlagiarismGuard',
        data: { metaDescription: 'Explore PlagiarismGuard pricing and features. Free, Pro, and Enterprise plans for students, educators, and content teams.' }
    },
    {
        path: 'why-us',
        component: WhyUsComponent,
        title: 'Why Choose PlagiarismGuard | AI Detection',
        data: { metaDescription: 'See why PlagiarismGuard outperforms traditional checkers with its 4-layer neural detection pipeline including perplexity analysis, semantic matching, and stylometric scanning.' }
    },
    {
        path: 'contact',
        component: ContactComponent,
        title: 'Contact Us | PlagiarismGuard',
        data: { metaDescription: 'Contact the PlagiarismGuard support team for help with detection reports, billing, enterprise plans, or general inquiries.' }
    },
    {
        path: 'privacy',
        component: PrivacyComponent,
        title: 'Privacy Policy | PlagiarismGuard',
        data: { metaDescription: 'Read the PlagiarismGuard Privacy Policy to understand how we collect, store, and protect your data.' }
    },
    {
        path: 'terms',
        component: TermsComponent,
        title: 'Terms of Service | PlagiarismGuard',
        data: { metaDescription: 'Review the PlagiarismGuard Terms of Service governing your use of our AI plagiarism detection platform.' }
    },
    {
        path: 'blog',
        loadComponent: () => import('./pages/blog/blog-list/blog-list.component').then(m => m.BlogListComponent),
        title: 'Blog & Resources | AI Plagiarism Detection',
        data: { metaDescription: 'In-depth articles on AI plagiarism detection, academic integrity, SEO content originality, and the latest developments in AI writing technology.' }
    },
    {
        path: 'blog/:slug',
        loadComponent: () => import('./pages/blog/blog-post/blog-post.component').then(m => m.BlogPostComponent),
        title: 'Blog | PlagiarismGuard AI'
        // Meta description for blog posts is set dynamically in BlogPostComponent via SeoService
    },

    // ─── Fix 404s: Redirect legacy Ahrefs-detected URLs to canonical paths ────
    { path: 'about-us',             redirectTo: 'about',    pathMatch: 'full' },
    { path: 'contact-us',           redirectTo: 'contact',  pathMatch: 'full' },
    { path: 'privacy-policy',       redirectTo: 'privacy',  pathMatch: 'full' },
    { path: 'terms-and-conditions', redirectTo: 'terms',    pathMatch: 'full' },
    { path: 'why-choose-us',        redirectTo: 'why-us',   pathMatch: 'full' },
    { path: 'pricing',              redirectTo: 'services', pathMatch: 'full' },

    {
        path: '**',
        component: NotFoundComponent,
        title: 'Page Not Found | PlagiarismGuard'
    }
];
