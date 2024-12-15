import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated$$ = new BehaviorSubject<boolean>(false);
  private userRole$$ = new BehaviorSubject<string | null>(null);
  private isBrowser: boolean;

  public isAuthenticated$ = this.isAuthenticated$$.asObservable();
  public userRole$ = this.userRole$$.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private getStorage(key: string): string | null {
    if (this.isBrowser) {
      return sessionStorage.getItem(key);
    }
    return null;
  }

  private setStorage(key: string, value: string): void {
    if (this.isBrowser) {
      sessionStorage.setItem(key, value);
    }
  }

  private removeStorage(key: string): void {
    if (this.isBrowser) {
      sessionStorage.removeItem(key);
    }
  }

  login(token: string, role: string) {
    this.setStorage('token', token);
    this.setStorage('userRole', role.toLowerCase());
    this.isAuthenticated$$.next(true);
    this.userRole$$.next(role.toLowerCase());
  }

  initAuthState() {
    const token = this.getStorage('token');
    if (token) {
      this.isAuthenticated$$.next(true);
      const role = this.getStorage('userRole');
      if (role) {
        this.userRole$$.next(role.toLowerCase());
      }
    }
  }

  logout() {
    this.removeStorage('token');
    this.removeStorage('userRole');
    this.isAuthenticated$$.next(false);
    this.userRole$$.next(null);
  }

  getToken(): string | null {
    return this.getStorage('token');
  }

  getUserRole(): 'user' | 'company' | null {
    return this.getStorage('userRole') as 'user' | 'company' | null;
  }
} 