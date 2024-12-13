import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { NotificationComponent } from '../notification/notification.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-add-company',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, NotificationComponent, CommonModule],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.css'
})
export class AddCompanyComponent implements OnInit {
  companyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.companyForm = this.fb.group({
      companyName: ['', Validators.required],
      ceo: ['', Validators.required],
      foundedYear: ['', [Validators.required, Validators.min(1800), Validators.max(new Date().getFullYear())]],
      website: ['', [Validators.required]],
      headquarters: ['', Validators.required],
      revenue: ['', [Validators.required, Validators.min(0)]],
      companySize: ['', [Validators.required, Validators.min(1)]],
      industry: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.companyForm.valid) {
      const token = this.authService.getToken();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.post('https://nethirebackend20241213133402.azurewebsites.net/api/Company/CreateCompany', this.companyForm.value, { headers })
        .subscribe({
          next: (response: any) => {
            if (response.responseSuccess) {
              this.notificationService.show('Company created successfully', 'success');
              this.router.navigate(['/companies']);
            } else {
              this.notificationService.show(response.message, 'error');
            }
          },
          error: (error) => {
            console.error('Error submitting company info:', error);
            this.notificationService.show('Something went wrong', 'error');
          }
        });
    }
  }
}
