import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated$$ = new BehaviorSubject<boolean>(false);
  private userRole$$ = new BehaviorSubject<string | null>(null);

  // Public observables that components can subscribe to
  public isAuthenticated$ = this.isAuthenticated$$.asObservable();
  public userRole$ = this.userRole$$.asObservable();

  constructor() {}

  login(token: string, role: string) {
    // Store auth data in sessionStorage
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userRole', role.toLowerCase());
    
    // Update the auth state observables
    this.isAuthenticated$$.next(true);
    this.userRole$$.next(role.toLowerCase());
  }

  initAuthState() {
    // Check for token in sessionStorage
    const token = sessionStorage.getItem('token');
    if (token) {
      // Update the auth state observables
      this.isAuthenticated$$.next(true);
      
      // Also restore the user role if you store it
      const role = sessionStorage.getItem('userRole');
      if (role) {
        this.userRole$$.next(role.toLowerCase());
      }
    }
  }

  logout() {
    // Clear sessionStorage on logout
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userRole');
    this.isAuthenticated$$.next(false);
    this.userRole$$.next(null);
  }

  // Helper method to get the current token (useful for HTTP interceptors)
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getUserRole(): 'user' | 'company' | null {
    // Implement your logic to get the user's role
    // This could be from localStorage, a state management solution, or an API call
    return sessionStorage.getItem('userRole') as 'user' | 'company' | null;
  }
} 