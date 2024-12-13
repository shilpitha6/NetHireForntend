import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { NotificationComponent } from '../../components/notification/notification.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
interface RegisterResponse {
  responseSuccess: boolean;
  status: number;
  id: number;
  message: string;
  data: any;
}

@Component({
  selector: 'app-company-signup',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, NotificationComponent, CommonModule, RouterModule],
  templateUrl: './company-signup.component.html',
  styleUrl: './company-signup.component.css'
})
export class CompanySignupComponent {
  public signUpForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private http: HttpClient, 
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  signUp() {
    if (this.signUpForm.valid) {
      const registerData = {
        firstName: this.signUpForm.value.firstName,
        lastName: this.signUpForm.value.lastName,
        email: this.signUpForm.value.email,
        password: this.signUpForm.value.password,
        role: 'Company'  // Changed from 'User' to 'Company'
      };

      this.http.post<RegisterResponse>('http://localhost:5249/api/account/register', registerData)
        .subscribe({
          next: (response) => {
            if (response.responseSuccess) {
              this.notificationService.show('Registration successful! Please login.', 'success');
              this.router.navigate(['/login']);
            } else {
              this.notificationService.show(response.message || 'Registration failed', 'error');
            }
          },
          error: (error) => {
            this.notificationService.show(error.error.message || 'Something went wrong', 'error');
          }
        });
    } else {
      Object.keys(this.signUpForm.controls).forEach(key => {
        const control = this.signUpForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
