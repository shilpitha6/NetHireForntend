import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { NotificationComponent } from '../notification/notification.component';
import { CommonModule } from '@angular/common';

// Add enums to match the backend
enum JobType {
  FullTime,
  PartTime,
  Contract,
  Internship
}

enum WorkSetting {
  OnSite,
  Remote,
  Hybrid
}

enum TravelRequirement {
  None,
  Occasional,
  Frequent
}

enum ApplyType {
  Internal,
  External
}

enum JobStatus {
  Active,
  Inactive
}

interface Company {
  companyId: string;
  userId: string;
  companyName: string;
  ceo: string;
  foundedYear: number;
  website: string;
  headquarters: string;
  revenue: number;
  companySize: number;
  industry: string;
}

interface ApiResponse {
  responseSuccess: boolean;
  status: number;
  id: number;
  message: string;
  data: Company[];
}

@Component({
  selector: 'app-add-job',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NotificationComponent
  ],
  templateUrl: './add-job.component.html',
  styleUrl: './add-job.component.css'
})
export class AddJobComponent implements OnInit {

  jobForm: FormGroup;
  companies: Company[] = [];
  isLoading = true;
  jobTypes = Object.keys(JobType).filter(key => isNaN(Number(key)));
  workSettings = Object.keys(WorkSetting).filter(key => isNaN(Number(key)));
  travelRequirements = Object.keys(TravelRequirement).filter(key => isNaN(Number(key)));
  applyTypes = Object.keys(ApplyType).filter(key => isNaN(Number(key)));
  jobStatuses = Object.keys(JobStatus).filter(key => isNaN(Number(key)));
  

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.jobForm = this.fb.group({
      companyId: ['', Validators.required],
      title: ['', Validators.required],
      location: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      jobType: ['', Validators.required],
      workSettings: ['', Validators.required],
      travelRequirement: ['', Validators.required],
      applyType: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies() {
    this.isLoading = true;
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    const endpoint = this.authService.getUserRole() === 'company' 
      ? 'http://localhost:5249/api/Company/GetCompaniesByUser'
      : 'http://localhost:5249/api/Company/GetCompanies';

    this.http.get<ApiResponse>(endpoint, { headers })
      .subscribe({
        next: (response) => {
          this.companies = response.data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading companies:', error);
          this.notificationService.show('Error loading companies', 'error');
          this.isLoading = false;
        }
      });
  }

  onSubmit() {
    if (this.jobForm.valid) {
      const token = this.authService.getToken();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      // Create a copy of the form values
      const formData = { ...this.jobForm.value };

      // Convert enum values to their string representations
      formData.jobType = JobType[formData.jobType];
      formData.workSettings = WorkSetting[formData.workSettings];
      formData.travelRequirement = TravelRequirement[formData.travelRequirement];
      formData.applyType = ApplyType[formData.applyType];
      formData.status = JobStatus[formData.status];

      this.http.post('http://localhost:5249/api/Job/CreateJob', formData, { headers })
        .subscribe({
          next: (response: any) => {
            if (response.responseSuccess) {
              this.notificationService.show('Job created successfully', 'success');
              this.router.navigate(['/jobs']);
            } else {
              this.notificationService.show(response.message, 'error');
            }
          },
          error: (error) => {
            console.error('Error submitting job info:', error);
            this.notificationService.show('Something went wrong', 'error');
          }
        });
    }
  }
}
