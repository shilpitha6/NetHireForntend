import { Injectable } from '@angular/core';
import * as process from 'process';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  private env: { [key: string]: string } = {};

  constructor() {
    // Load environment variables
    this.env = {
      apiUrl: process.env['API_URL'] || 'https://nethirebackend20241213133402.azurewebsites.net/api'
    };
  }

  get(key: string): string {
    return this.env[key];
  }
} 