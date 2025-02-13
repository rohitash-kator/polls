import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

import { Poll } from '../../../data-types';
import { ApiService } from '../../../services/api.service';
import { NotificationsComponent } from '../../shared/notifications/notifications.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatListModule, MatButtonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  polls: Poll[] = [];
  activePolls: Poll[] = [];
  expiredPolls: Poll[] = [];
  closedPolls: Poll[] = [];

  constructor(
    private readonly router: Router,
    private readonly apiService: ApiService,
    private readonly notification: NotificationsComponent
  ) {
    this.apiService.getAllPolls().subscribe({
      next: (response: any) => {
        this.polls = response?.polls;
        this.onLoadPolls();
        this.notification.openSnackBar({
          message: 'Polls loaded successfully',
          type: 'success',
        });
      },
      error: (error) => {
        console.error('Error Fetching Polls: ', error);
        this.notification.openSnackBar({
          message: 'Error fetching polls. Please try again later.',
          type: 'error',
        });
      },
    });
  }

  onLoadPolls(): void {
    const currentDate = new Date();

    // Active polls are those that are both active and not expired
    this.activePolls = this.polls.filter(
      (poll) => poll.isActive && new Date(poll.expiresAt) > currentDate
    );

    // Expired polls should not include closed ones (polls that are not active)
    this.expiredPolls = this.polls.filter(
      (poll) => poll.isActive && new Date(poll.expiresAt) <= currentDate
    );

    // Closed polls are those that are not active, regardless of expiration
    this.closedPolls = this.polls.filter((poll) => !poll.isActive);
  }

  onCreatePoll(): void {
    this.router.navigate(['/admin/create']);
  }

  onClosePoll(pollId: string): void {
    const pollIndex = this.polls.findIndex((poll) => poll._id === pollId);

    if (pollIndex > -1) {
      this.apiService.closePoll(pollId).subscribe({
        next: (response: any) => {
          // Update the poll status locally
          this.polls[pollIndex].isActive = false;
          this.onLoadPolls();

          // Display success notification
          this.notification.openSnackBar({
            message: 'Poll closed successfully.',
            type: 'success',
          });
        },
        error: (error) => {
          console.error('Error closing poll: ', error);

          // Handle backend errors
          if (error.status === 403) {
            // Unauthorized error (user is not an admin)
            this.notification.openSnackBar({
              message: 'You are not allowed to close a poll.',
              type: 'error',
            });
          } else if (error.status === 404) {
            // Poll not found
            this.notification.openSnackBar({
              message: 'Poll not found.',
              type: 'error',
            });
          } else if (error.status === 400) {
            if (error.error.message === 'Poll is already closed') {
              // Poll is already closed
              this.notification.openSnackBar({
                message: 'Poll is already closed.',
                type: 'error',
              });
            } else if (error.error.message === 'Poll is already expired') {
              // Poll is expired
              this.notification.openSnackBar({
                message: 'Poll is already expired.',
                type: 'error',
              });
            }
          } else {
            // Generic error
            this.notification.openSnackBar({
              message:
                'An error occurred while closing the poll. Please try again later.',
              type: 'error',
            });
          }
        },
      });
    } else {
      // Handle case where the poll is not found in the local polls list
      this.notification.openSnackBar({
        message: 'Poll not found in the local list.',
        type: 'error',
      });
    }
  }

  onViewPollResult(pollId: string): void {
    this.router.navigate(['/admin/poll/result', pollId]);
  }
}
