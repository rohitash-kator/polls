import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  user: any;

  constructor(
    private readonly router: Router,
    private readonly apiService: ApiService,
    private readonly notification: NotificationsComponent
  ) {
    this.apiService.currentUser.subscribe({
      next: (response: any) => {
        const user = response?.user;
        if (user) {
          this.user = user;
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (error: any) => {
        console.error('Error initiating current user. Error: ', error);
        this.notification.openSnackBar({
          message: 'Error fetching user details. Please try again later.',
          type: 'error',
        });
      },
    });
  }
}
