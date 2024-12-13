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
import { AddCompanyComponent } from './components/add-company/add-company.component';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';
import { AddJobComponent } from './components/add-job/add-job.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { EditUserProfileComponent } from './components/edit-user-profile/edit-user-profile.component';
import { ApplicationComponent } from './components/application/application.component';
import { ApplicationListComponent } from './components/application-list/application-list.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'login', component: LoginPageComponent },
      { path: 'signUp', component: SignupUpPageComponent },
      { path: 'home', component: HomeComponent },
      { path: 'companies', component: CompanyListComponent },
      { path: 'company-details/:id', component: CompanyDetailsComponent },
      { path: 'job-details/:id', component: JobDetailsComponent },
      { path: 'jobs', component: JobListComponent },
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
        component: CompanySignupComponent
      },
      { 
        path: 'add-user-contact-info', 
        component: AddUserContactInfoComponent,
        canActivate: [RoleGuard],
        data: { role: 'user' }
      },
      { 
        path: 'add-company', 
        component: AddCompanyComponent,
        canActivate: [RoleGuard],
        data: { role: 'company' }
      },
      { 
        path: 'add-job', 
        component: AddJobComponent,
        canActivate: [RoleGuard],
        data: { role: 'company' }
      },
      { 
        path: 'edit-profile', 
        component: EditUserProfileComponent,
        canActivate: [RoleGuard],
        data: { role: 'user' }
      },
      { 
        path: 'application/:jobId', 
        component: ApplicationComponent,
        canActivate: [RoleGuard],
        data: { role: 'user' }
      },
      { 
        path: 'application-list/:jobId', 
        component: ApplicationListComponent
      }
    ]
  }
];
