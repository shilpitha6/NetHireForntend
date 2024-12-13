import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


interface ApiResponse<T> {
  responseSuccess: boolean;
  status: number;
  id: number;
  message: string;
  data: T;
}

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
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.css'
})
export class JobDetailsComponent implements OnInit {
  job: Job | undefined;
  role: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadJob(id);
        this.role = this.authService.getUserRole();

      }
    });
  }

  private loadJob(id: string): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.get<ApiResponse<Job>>(`http://localhost:5249/api/Job/GetJob/${id}`, { headers })
      .subscribe({
        next: (response) => {
          this.job = response.data;
          console.log(this.job);
        },
        error: (error) => {
          console.error('Error loading job:', error);
        }
      });
  }
}
