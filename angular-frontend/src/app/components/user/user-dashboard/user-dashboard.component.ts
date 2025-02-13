import { Component } from '@angular/core';
import { type Poll } from '../../../data-types';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../../services/api.service';
import { NotificationsComponent } from '../../shared/notifications/notifications.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent {
  polls: Poll[] = [];

  constructor(
    private readonly router: Router,
    private readonly apiService: ApiService,
    private readonly notification: NotificationsComponent
  ) {
    this.apiService.getActivePolls().subscribe({
      next: (response: any) => {
        this.polls = response?.polls;

        // Success notification
        this.notification.openSnackBar({
          message: 'Polls loaded successfully.',
          type: 'success',
        });
      },
      error: (error) => {
        console.error('Error Fetching Polls: ', error);

        // Error notification
        this.notification.openSnackBar({
          message: 'Failed to load polls. Please try again later.',
          type: 'error',
        });
      },
    });
  }

  onViewPoll(pollId: string): void {
    this.router.navigate(['user/poll/', pollId]);
  }
}
