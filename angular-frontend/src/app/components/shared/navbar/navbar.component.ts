import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean | undefined = undefined;
  currentUser: any;

  constructor(
    private readonly router: Router,
    private readonly apiService: ApiService,
    private readonly notification: NotificationsComponent
  ) {
    this.apiService.isLoggedIn.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.apiService.currentUser.subscribe({
      next: (response: any) => {
        const user = response?.user;
        if (user) {
          this.currentUser = user;
          this.isAdmin = user?.role === 'Admin';
          this.router.navigate([user?.role === 'Admin' ? '/admin' : '/user']);
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

  ngOnInit(): void {
    this.apiService.isLoggedIn.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  onLogout(): void {
    this.apiService.logout().subscribe({
      next: (response: any) => {
        this.isAdmin = undefined;
        this.isLoggedIn = false;
        this.router.navigate(['/login']);

        // Notify user on successful logout
        this.notification.openSnackBar({
          message: 'You have logged out successfully.',
          type: 'success',
        });
      },
      error: (error) => {
        console.error('Logout error: ', error);
        // Notify user on logout error
        this.notification.openSnackBar({
          message: 'An error occurred during logout. Please try again later.',
          type: 'error',
        });
      },
    });
  }
}
