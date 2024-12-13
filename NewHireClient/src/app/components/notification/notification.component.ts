import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="notification" [ngClass]="currentNotification.type">
      <div class="notification-content">
        <span>{{ currentNotification.message }}</span>
        <button class="close-btn" (click)="hideNotification()">×</button>
      </div>
    </div>
  `,
  styles: [`
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px;
      border-radius: 4px;
      z-index: 1000;
      min-width: 300px;
      animation: slideIn 0.3s ease-in;
    }
    .notification-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .close-btn {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      font-size: 20px;
    }
    .success {
      background-color: #4caf50;
      color: white;
    }
    .error {
      background-color: #f44336;
      color: white;
    }
    .info {
      background-color: #2196F3;
      color: white;
    }
    .warning {
      background-color: #ff9800;
      color: white;
    }
    @keyframes slideIn {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }
  `]
})
export class NotificationComponent implements OnInit {
  show = false;
  currentNotification: { message: string; type: string; } = { message: '', type: 'info' };
  private timeout: any;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.getNotifications().subscribe(notification => {
      this.currentNotification = notification;
      this.show = true;
      
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      
      this.timeout = setTimeout(() => {
        this.hideNotification();
      }, 5000);
    });
  }

  hideNotification() {
    this.show = false;
  }
} 