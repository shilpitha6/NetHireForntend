import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignupUpPageComponent } from './components/signup-up-page/signup-up-page.component';
import { HomeComponent } from './components/home/home.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { CompanyHomeComponent } from './components/company-home/company-home.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { CompanySignupComponent } from './components/company-signup/company-signup.component';
import { RoleGuard } from './guards/role.guard';
import { AddUserContactInfoComponent } from './components/add-user-contact-info/add-user-contact-info.component';
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'login', component: LoginPageComponent },
      { path: 'signUp', component: SignupUpPageComponent },
      { path: 'home', component: HomeComponent },
      { 
        path: 'user-home', 
        component: UserHomeComponent,
        canActivate: [RoleGuard],
        data: { role: 'user' }
      },
      { 
        path: 'company-home', 
        component: CompanyHomeComponent,
        canActivate: [RoleGuard],
        data: { role: 'company' }
      },
      { 
        path: 'company-signup', 
        component: CompanySignupComponent,
        canActivate: [RoleGuard],
        data: { role: 'company' }
      },
      { 
        path: 'add-user-contact-info', 
        component: AddUserContactInfoComponent,
        canActivate: [RoleGuard],
        data: { role: 'user' }
      }
    ]
  }
];
