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


@Component({
  selector: 'app-add-user-contact-info',
  templateUrl: './add-user-contact-info.component.html',
  styleUrls: ['./add-user-contact-info.component.css'],
  imports: [ReactiveFormsModule, HttpClientModule, NgxMaskDirective, NotificationComponent],
  providers: [provideNgxMask()],
  standalone: true
})
export class AddUserContactInfoComponent implements OnInit {
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
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const token = this.authService.getToken();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.post('https://nethirebackend20241213133402.azurewebsites.net/api/ContactInfo/AddContactInfo', this.contactForm.value, { headers })
        .subscribe({
          next: (response: any) => {
            if (response.responseSuccess) {
              this.router.navigate(['/user-home']);
            } else {
              this.notificationService.show(response.message, 'error');
            }
          },
          error: (error) => {
            console.error('Error submitting contact info:', error);
            this.notificationService.show('Something went wrong', 'error');
          }
        });
    }
  }
}
