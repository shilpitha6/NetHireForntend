import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { NotificationComponent } from '../notification/notification.component';

// Add these interfaces
interface ApiResponse<T> {
  responseSuccess: boolean;
  status: number;
  id: number;
  message: string;
  data: T;
}

interface ContactInfo {
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
}

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, NotificationComponent],
  templateUrl: './application.component.html',
  styleUrl: './application.component.css'
})
export class ApplicationComponent implements OnInit {
  applicationForm: FormGroup;
  jobId: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.applicationForm = this.fb.group({
      applicationId: [''],
      userId: [''],
      jobId: [''],
      firstName: ['', [Validators.required]],
      middleName: [''],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      altPhone: [''],
      email: ['', [Validators.required, Validators.email]],
      altEmail: ['', [Validators.email]],
      streetAddress: ['', [Validators.required]],
      address2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      status: ['Pending']
    });
    this.jobId = this.router.url.split('/').pop() || '';
  }

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<ApiResponse<ContactInfo>>('http://localhost:5249/api/ContactInfo/GetContactInfoByUserId', { headers })
      .subscribe({
        next: (response) => {
          if (response.data) {
            // Pre-populate the form with user's contact information
            this.applicationForm.patchValue({
              phone: response.data.phone,
              altPhone: response.data.altPhone || '',
              email: response.data.email,
              altEmail: response.data.altEmail || '',
              streetAddress: response.data.streetAddress,
              address2: response.data.address2 || '',
              city: response.data.city,
              state: response.data.state,
              zipCode: response.data.zipCode
            });
            this.applicationForm.patchValue({
              phone: response.data.phone,
              altPhone: response.data.altPhone || '',
              email: response.data.email,
              altEmail: response.data.altEmail || '',
              streetAddress: response.data.streetAddress,
              address2: response.data.address2 || '',
              city: response.data.city,
              state: response.data.state,
              zipCode: response.data.zipCode
            });
          }

        },
        error: (error) => {
          console.error('Error loading user details:', error);
          this.notificationService.show('Error loading user information', 'error');
        }
      });
  }

  onSubmit() {
    if (this.applicationForm.valid) {
      const token = this.authService.getToken();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.post('http://localhost:5249/api/Application/' + this.jobId, this.applicationForm.value, { headers })
        .subscribe({
          next: (response: any) => {
            if (response.responseSuccess) {
              this.router.navigate(['/user-home']);
            } else {
              this.notificationService.show(response.message, 'error');
            }
          },
          error: (error) => {
            console.error('Error submitting application:', error);
            this.notificationService.show('Something went wrong', 'error');
          }
        });
    }
  }
}
