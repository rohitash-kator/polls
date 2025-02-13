import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../../services/api.service';
import { NotificationsComponent } from '../../shared/notifications/notifications.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly apiService: ApiService,
    private readonly notification: NotificationsComponent
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.min(6), Validators.maxLength(32)],
      ],
    });
  }

  onLogin() {
    if (!this.loginForm.valid) {
      console.error('Check your details!');
      this.notification.openSnackBar({
        message: 'Please fill in all required fields correctly.',
        type: 'error',
      });
      return;
    }

    this.apiService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        // Save the token in localStorage or a service as needed
        this.notification.openSnackBar({
          message: 'Logged in Successfully',
          type: 'success',
        });

        // Optionally, navigate to a different route after successful login
        // this.router.navigate(['/dashboard']); // Example
      },
      error: (error) => {
        console.error('Login Error', error);

        // Handle validation errors sent by the backend
        if (
          error.status === 400 &&
          error.error.message === 'Validation Error' &&
          error.error.errors
        ) {
          // Loop through the errors array and display each validation error
          const validationMessages = error.error.errors
            .map((err: any) => err.msg)
            .join(', ');

          this.notification.openSnackBar({
            message: `Validation Error: ${validationMessages}`,
            type: 'error',
          });
        } else if (error.status === 404) {
          // User not found error
          this.notification.openSnackBar({
            message: 'User not found. Please check your credentials.',
            type: 'error',
          });
        } else if (error.status === 401) {
          // Invalid password error
          this.notification.openSnackBar({
            message: 'Invalid password. Please try again.',
            type: 'error',
          });
        } else {
          // General error message for other cases
          this.notification.openSnackBar({
            message: 'An error occurred. Please try again later.',
            type: 'error',
          });
        }
      },
    });
  }
}
