import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Add new interface for API response
interface ApiResponse<T> {
  responseSuccess: boolean;
  status: number;
  id: number;
  message: string;
  data: T;
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

// Add Job interface
interface Job {
  jobId: string;
  companyId: string;
  title: string;
  location: string;
  salary: number;
  description: string;
  jobType: string;
  workSettings: string;
  travelRequirement: string;
  applyType: string;
  status: string;
  company: any;
}

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {
  company: Company | undefined;
  jobs: Job[] = [];  // Add jobs array

  constructor(
    private route: ActivatedRoute,
    private router: Router,  // Add router
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadCompany(id);
        this.loadJobs(id);
      }
    });
  }

  private loadCompany(id: string): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<ApiResponse<Company>>(`http://localhost:5249/api/Company/GetCompany/${id}`, { headers })
      .subscribe({
        next: (response) => {
          this.company = response.data;
          console.log(this.company);  // Access the company data from the response
        },
        error: (error) => {
          console.error('Error loading company:', error);
          // Handle error appropriately (e.g., show error message to user)
        }
      });
  }

  private loadJobs(companyId: string): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.get<ApiResponse<Job[]>>(`http://localhost:5249/api/Job/GetJobsByCompanyId?companyId=${companyId}`, { headers })
      .subscribe({
        next: (response) => {
          this.jobs = response.data;
        },
        error: (error) => {
          console.error('Error loading jobs:', error);
        }
      });
  }

  navigateToJobDetails(jobId: string): void {
    this.router.navigate(['/jobs', jobId]);
  }
}
