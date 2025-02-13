import { Component } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

import { NotificationData } from '../../../data-types';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [MatSnackBarModule],
  providers: [MatSnackBarConfig],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent {
  private notificationQueue: NotificationData[] = [];

  constructor(private readonly snackBar: MatSnackBar) {}

  openSnackBar(notificationData: NotificationData): void {
    this.notificationQueue.push(notificationData);

    this.displayNotifications();
    this.notificationQueue = [];
  }

  private displayNotifications(): void {
    this.snackBar._openedSnackBarRef?.dismiss();

    let delay = 0;

    this.notificationQueue.forEach((notification) => {
      setTimeout(() => {
        this.showNotification(notification);
      }, delay);
      delay += 600;
    });
  }

  private showNotification(notificationData: NotificationData): void {
    let panelClass: string = '';

    switch (notificationData.type) {
      case 'success':
        panelClass = 'success-snackbar';
        break;

      case 'error':
        panelClass = 'error-snackbar';
        break;

      case 'info':
        panelClass = 'info-snackbar';
        break;

      case 'warning':
        panelClass = 'warning-snackbar';
        break;
      default:
        panelClass = 'info-snackbar';
    }

    // Show component in snackbar
    // this.snackBar.openFromComponent("PROVIDE_COMPONENT", {duration: 5000});

    this.snackBar.open(notificationData.message, 'Close', {
      duration: 5000,
      panelClass: [panelClass],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
