import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatButtonModule, MatToolbarModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  isAdmin: boolean | undefined = undefined;
  currentUser: any;

  constructor(
    private readonly router: Router,
    private readonly apiService: ApiService
  ) {
    this.isLoggedIn = this.apiService.isLoggedIn();
    console.log('isLoggedIn: ', this.isLoggedIn);
    this.currentUser = this.apiService.currentUser.subscribe({
      next: (response: any) => {
        const user = response?.user;
        if (user) {
          this.currentUser = user;
          console.log('User Role: ', user?.role);
          this.isAdmin = user?.role === 'Admin';
          this.router.navigate([user?.role === 'Admin' ? '/admin' : '/user']);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (error: any) => {
        console.log('Error initiating current user. Error: ', error);
      },
    });
  }

  onLogout(): void {
    console.log('Log out initiated...');
    this.apiService.logout().subscribe({
      next: (response: any) => {
        console.log('User Logged Out successfully.', response);
        this.isAdmin = undefined;
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
