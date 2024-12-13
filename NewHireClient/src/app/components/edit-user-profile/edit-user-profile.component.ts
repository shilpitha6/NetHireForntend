import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AuthService } from '../../services/auth.service';
import { NotificationComponent } from '../../components/notification/notification.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.css'],
  imports: [ReactiveFormsModule, HttpClientModule, NgxMaskDirective, NotificationComponent, CommonModule, RouterModule],
  providers: [provideNgxMask()],
  standalone: true
})
export class EditUserProfileComponent implements OnInit {
  contactForm: FormGroup;
  phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.contactForm = this.fb.group({
      contactInfoId: [''],
      userId: [''],
      phone: ['', [Validators.required]],
      altPhone: [''],
      email: ['', [Validators.required, RxwebValidators.email()]],
      altEmail: ['', [RxwebValidators.email()]],
      streetAddress: ['', [Validators.required]],
      address2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]]
    });
  }

  ngOnInit(): void {
    this.loadUserContactInfo();
  }

  loadUserContactInfo() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<ApiResponse<ContactInfo>>('https://nethirebackend20241213133402.azurewebsites.net/api/ContactInfo/GetContactInfoByUserId', { headers })
      .subscribe({
        next: (response) => {
          if (response.data) {
            const formattedData = {
              ...response.data,
              phone: this.formatPhoneNumber(response.data.phone),
              altPhone: response.data.altPhone ? this.formatPhoneNumber(response.data.altPhone) : ''
            };
            this.contactForm.patchValue(formattedData);
          }
        },
        error: (error) => {
          console.error('Error loading contact info:', error);
          this.notificationService.show('Error loading contact information', 'error');
        }
      });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const token = this.authService.getToken();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      const formData = {
        contactInfoId: this.contactForm.value.contactInfoId,
        userId: this.contactForm.value.userId,
        phone: this.stripPhoneFormat(this.contactForm.value.phone),
        altPhone: this.contactForm.value.altPhone ? this.stripPhoneFormat(this.contactForm.value.altPhone) : '',
        email: this.contactForm.value.email,
        altEmail: this.contactForm.value.altEmail || '',
        streetAddress: this.contactForm.value.streetAddress,
        address2: this.contactForm.value.address2 || '',
        city: this.contactForm.value.city,
        state: this.contactForm.value.state,
        zipCode: this.contactForm.value.zipCode
      };

      this.http.put<ApiResponse<ContactInfo>>('https://nethirebackend20241213133402.azurewebsites.net/api/ContactInfo/UpdateContactInfo', formData, { headers })
        .subscribe({
          next: (response) => {
            if (response.responseSuccess) {
              this.notificationService.show('Contact information updated successfully', 'success');
              this.router.navigate(['/user-home']);
            } else {
              this.notificationService.show(response.message || 'Update failed', 'error');
            }
          },
          error: (error) => {
            console.error('Error updating contact info:', error);
            this.notificationService.show('Error updating contact information', 'error');
          }
        });
    }
  }

  formatPhoneNumber(phone: string): string {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  stripPhoneFormat(phone: string): string {
    return phone.replace(/[^0-9]/g, '');
  }
}
