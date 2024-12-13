import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service'; // Assuming you have an auth service
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; 

// Add these interfaces
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
  selector: 'app-company-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.css'
})
export class CompanyListComponent implements OnInit {
  companies: Company[] = [];
  isEditSidebarOpen = false;
  editForm: FormGroup;
  currentCompanyId: number | null = null;
  userRole: string | null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.userRole = this.authService.getUserRole();
    this.editForm = this.fb.group({
      companyName: [''],
      industry: [''],
      ceo: [''],
      foundedYear: [''],
      headquarters: [''],
      companySize: [''],
      revenue: [''],
      website: ['']
    });
  }

  ngOnInit() {
    this.loadCompanies();
  }

  private loadCompanies() {
    const endpoint = this.authService.getUserRole() === 'company' 
      ? 'https://nethirebackend20241213133402.azurewebsites.net/api/Company/GetCompaniesByUser'
      : 'https://nethirebackend20241213133402.azurewebsites.net/api/Company/GetCompanies';
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<ApiResponse>(endpoint, { headers }).subscribe(
      response => this.companies = response.data,
      error => console.error('Error fetching companies:', error)
    );
  }

  openEditDialog(company: any) {
    this.currentCompanyId = company.id;
    this.editForm.patchValue(company);
    this.isEditSidebarOpen = true;
  }

  onSubmit() {
    if (this.editForm.valid && this.currentCompanyId) {
      const updatedCompany = {
        id: this.currentCompanyId,
        ...this.editForm.value
      };

      this.http.put(`/api/Company/UpdateCompany/${this.currentCompanyId}`, updatedCompany)
        .subscribe({
          next: (response) => {
            this.isEditSidebarOpen = false;
            this.loadCompanies();
          },
          error: (error) => {
            console.error('Error updating company:', error);
          }
        });
    }
  }

  closeSidebar() {
    this.isEditSidebarOpen = false;
  }
}
