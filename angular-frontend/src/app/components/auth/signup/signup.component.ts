import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../../services/api.service';
import { NotificationsComponent } from '../../shared/notifications/notifications.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly apiService: ApiService,
    private readonly notification: NotificationsComponent
  ) {
    this.signupForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(32),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(32),
        ],
      ],
    });
  }

  onSignup() {
    if (!this.signupForm.valid) {
      console.error('Please check your details!');
      this.errorMessage = 'Please check your details!';
      return;
    }

    const { password, confirmPassword } = this.signupForm.value;

    // Ensure the passwords match
    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    this.apiService.signup(this.signupForm.value).subscribe({
      next: (response: any) => {
        this.notification.openSnackBar({
          message: 'Signed up Successfully',
          type: 'success',
        });
        // Optionally redirect or do further actions
      },
      error: (error) => {
        console.error('Signup Error', error);

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
        } else if (
          error.status === 400 &&
          error.error.message === 'User already exists'
        ) {
          // Handle case when the user already exists
          this.notification.openSnackBar({
            message: 'User with this email already exists!',
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
