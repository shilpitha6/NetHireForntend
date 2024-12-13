import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// First, define interfaces for the API response and Application type
interface ApiResponse<T> {
  responseSuccess: boolean;
  status: number;
  id: number;
  message: string | null;
  data: T[];
}

interface Application {
  applicationId: string;
  userId: string;
  jobId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  altPhone: string;
  email: string;
  altEmail: string;
  streetAddress: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  personalDetails: any | null;
  emergencyContactId: string | null;
  educationId: string | null;
  previousEmploymentId: string | null;
  professionalReferenceId: string | null;
  documents: any | null;
  status: string;
  job: any | null;
  emergencyContact: any | null;
  education: any | null;
  previousEmployment: any | null;
  professionalReference: any | null;
}

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application-list.component.html',
  styleUrl: './application-list.component.css'
})
export class ApplicationListComponent implements OnInit {
  applications: Application[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadApplications();
  }

  private loadApplications() {
    const userRole = this.authService.getUserRole();
    const jobId = this.router.url.split('/').pop() || '';

    const apiUrl = userRole === 'user' 
      ? `https://nethirebackend20241213133402.azurewebsites.net/api/Application/user`
      : `https://nethirebackend20241213133402.azurewebsites.net/api/Application/job/${jobId}`;

    this.http.get<ApiResponse<Application>>(apiUrl).subscribe({
      next: (response) => {
        this.applications = response.data;
      },
      error: (error) => {
        console.error('Error fetching applications:', error);
      }
    });
  }
}
