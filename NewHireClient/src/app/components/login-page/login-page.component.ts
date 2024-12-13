import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
interface LoginResponse {
  responseSuccess: boolean;
  status: number;
  id: number;
  message: string;
  data: {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    refreshToken: string | null;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface ContactInfoResponse {
  responseSuccess: boolean;
  status: number;
  id: number;
  message: string;
  data: {
    contactInfoId: string;
    userId: string;
    phone: string;
    altPhone: string;
    email: string;
    altEmail: string;
    streetAddress: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
  } | null;
}

interface CompanyResponse {
  responseSuccess: boolean;
  status: number;
  id: number;
  message: string;
  data: any[]; // Array of companies
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  public loginForm!: FormGroup

  constructor(
    private formbuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: [''],
      password: ['', Validators.required]
    })
  }
  login(){
    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.http.post<LoginResponse>("https://nethirebackend20241213133402.azurewebsites.net/api/account/login", loginData)
      .subscribe({
        next: (response) => {
          if (response.responseSuccess && response.data) {
            this.authService.login(response.data.accessToken, response.data.role);
            if (response.data.role.toLowerCase() === 'company') {
              this.checkCompanyExists(response.data.accessToken);
            } else {
              this.checkUserContactInfo(response.data.accessToken);
            }
          }
        },
        error: (error) => {
          alert(error.error.message || 'Something went wrong');
        }
      });
  }

  private checkUserContactInfo(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.get<ContactInfoResponse>(
      "https://nethirebackend20241213133402.azurewebsites.net/api/ContactInfo/GetContactInfoByUserId",
      { headers }
    ).subscribe({
      next: (response) => {
        if (response.responseSuccess && response.data) {
          this.router.navigate(['/user-home']);
        } else {
          this.router.navigate(['/add-user-contact-info']);
        }
      },
      error: (error) => {
        this.router.navigate(['/add-user-contact-info']);
      }
    });
  }

  private checkCompanyExists(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.get<CompanyResponse>(
      "https://nethirebackend20241213133402.azurewebsites.net/api/Company/GetCompaniesByUser",
      { headers }
    ).subscribe({
      next: (response) => {
        if (response.responseSuccess && response.data && response.data.length > 0) {
          this.router.navigate(['/company-home']);
        } else {
          this.router.navigate(['/add-company']);
        }
      },
      error: (error) => {
        this.router.navigate(['/add-company']);
      }
    });
  }

}
