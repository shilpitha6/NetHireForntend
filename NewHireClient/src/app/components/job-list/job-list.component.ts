import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

interface Job {
  jobId: string;
  companyId: string;
  title: string;
  description: string;
  companySize: string;
  status: string;
  location: string;
  salary: number;
  jobType: string;
  experienceLevel: string;
  workSettings: string;
}

interface ApiResponse {
  responseSuccess: boolean;
  status: number;
  id: number;
  message: string;
  data: Job[];
}

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css'
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  userRole: string | null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.userRole = this.authService.getUserRole();
  }

  ngOnInit() {
    this.loadJobs();
  }

  private loadJobs() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Choose endpoint based on user role
    const endpoint = this.authService.getUserRole() === 'company' 
      ? 'https://nethirebackend20241213133402.azurewebsites.net/api/Job/GetJobsByUserId'
      : 'https://nethirebackend20241213133402.azurewebsites.net/api/Job/GetJobs';

    this.http.get<ApiResponse>(endpoint, { headers }).subscribe(
      response => this.jobs = response.data,
      error => console.error('Error fetching jobs:', error)
    );
  }
}
