import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

import { Poll } from '../../../data-types';
import { ApiService } from '../../../services/api.service';

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
    private readonly apiService: ApiService
  ) {
    this.apiService.getAllPolls().subscribe({
      next: (response: any) => {
        console.log(
          'All Poll response from the Admin dashboard component: ',
          response
        );
        this.polls = response?.polls;
        this.onLoadPolls();
      },
      error: (error) => {
        console.error('Error Fetching Polls: ', error);
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
          console.log('Poll closed Successfully: ', response);
          this.polls[pollIndex].isActive = false;
          this.onLoadPolls();
        },
        error: (error) => {
          console.log('Error Closing poll: ', error);
        },
      });
      this.onLoadPolls();
    }
  }

  onViewPollResult(pollId: string): void {
    this.router.navigate(['/admin/poll/result', pollId]);
  }
}
