import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm">
        <nav class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div class="flex items-center">
            <a [routerLink]="(authService.userRole$ | async) === 'user' ? '/user-home' : 
                           (authService.userRole$ | async) === 'company' ? '/company-home' : '/'" 
               class="flex items-center space-x-2">
              <h1 class="text-xl font-semibold text-gray-900">NetHire</h1>
            </a>
          </div>
          
          <div class="hidden md:flex items-center space-x-8">
            <ng-container *ngIf="(authService.userRole$ | async) === 'user'">
              <a routerLink="/jobs" class="text-gray-600 hover:text-gray-900">Jobs</a>
              <a routerLink="/companies" class="text-gray-600 hover:text-gray-900">Companies</a>
              <a routerLink="/my-applications" class="text-gray-600 hover:text-gray-900">My Applications</a>
            </ng-container>
            <ng-container *ngIf="(authService.userRole$ | async) === 'company'">
              <a routerLink="/companies" class="text-gray-600 hover:text-gray-900">Companies</a>
              <a routerLink="/jobs" class="text-gray-600 hover:text-gray-900">Jobs</a>
              <a routerLink="/candidates" class="text-gray-600 hover:text-gray-900">Candidates</a>
            </ng-container>
          </div>

          <div class="flex items-center space-x-4">
            <ng-container *ngIf="!(authService.isAuthenticated$ | async); else authenticatedButtons">
              <a routerLink="/login" class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Sign in
              </a>
              <a routerLink="/signUp" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Sign up
              </a>
            </ng-container>
            <ng-template #authenticatedButtons>
              <button (click)="logout()" class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Logout
              </button>
            </ng-template>
          </div>
        </nav>
      </header>

      <main class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <router-outlet />
      </main>

      <footer class="bg-white border-t">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p class="text-center text-gray-500 text-sm">© 2024 NetHire. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `
})
export class MainLayoutComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.authService.initAuthState();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
} 