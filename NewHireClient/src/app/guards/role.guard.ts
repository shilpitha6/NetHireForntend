import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service'; // You'll need to create/modify this

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'];
    const userRole = this.authService.getUserRole(); // Implement this method in your AuthService

    if (userRole === requiredRole) {
      return true;
    }

    // Redirect to appropriate home page based on role
    if (userRole === 'user') {
      this.router.navigate(['/user-home']);
    } else if (userRole === 'company') {
      this.router.navigate(['/company-home']);
    } else {
      this.router.navigate(['/login']);
    }
    
    return false;
  }
} 