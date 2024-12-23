import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { CustomerAuthComponent } from './components/customer-auth/customer-auth.component';
import { ContactComponent } from './components/contact/contact.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { CardsComponent } from './components/cards/cards.component';
import { OffersComponent } from './components/offers/offers.component';
import { InvestmentInsuranceComponent } from './components/investment-insurance/investment-insurance.component';


export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'register',component:CreateAccountComponent},
    {path:'admin',component:AdminComponent},
    {path:'login',component:CustomerAuthComponent},
    {path:'contact',component:ContactComponent},
    {path:'details',component:UserDetailsComponent},
    {path:'admin-dashboard',component:AdminDashboardComponent},
    {path:'cards',component:CardsComponent},
    {path:'offers',component:OffersComponent},
    {path:'investment',component:InvestmentInsuranceComponent}
    
];
