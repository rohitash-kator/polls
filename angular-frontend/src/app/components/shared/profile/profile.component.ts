import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

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
    private readonly apiService: ApiService
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
        console.log('Error initiating current user. Error: ', error);
      },
    });
  }
}
