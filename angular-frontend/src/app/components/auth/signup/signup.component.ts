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
    private readonly apiService: ApiService
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
      return;
    }

    const { password, confirmPassword } = this.signupForm.value;

    // Ensure the passwords match
    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    console.log('From SignUp Component', this.signupForm.value);
    this.apiService.signup(this.signupForm.value).subscribe({
      next: (user) => {
        console.log(user);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
