import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { AboutComponent } from '../pages/about/about.component';
import { ServicesComponent } from '../pages/services/services.component';
import { WhyUsComponent } from '../pages/why-us/why-us.component';
import { ContactComponent } from '../pages/contact/contact.component';

export const routes: Routes = [
    {
        path:'',
        title:'Home',
        component:HomeComponent
    },
    {
        path:'home',
        component:HomeComponent,
        title:'Home'
    },
    {
        path:'about',
        component:AboutComponent,
        title:'About Us'
    },
    {
        path:'services',
        component:ServicesComponent,
        title:'Our Services'
    },
    {
        path:'why-us',
        component:WhyUsComponent,
        title:'Why Choose Us'
    },
    {
        path:'contact',
        component:ContactComponent,
        title:'Contact Us'
    }
];
