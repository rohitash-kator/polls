import { Component } from '@angular/core';
import { type Poll } from '../../../data-types';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../../services/api.service';

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
    private readonly apiService: ApiService
  ) {
    this.apiService.getActivePolls().subscribe({
      next: (response: any) => {
        console.log(
          'All Poll response from the Admin dashboard component: ',
          response
        );
        this.polls = response?.polls;
      },
      error: (error) => {
        console.error('Error Fetching Polls: ', error);
      },
    });
  }

  onViewPoll(pollId: string): void {
    this.router.navigate(['user/poll/', pollId]);
  }
}
