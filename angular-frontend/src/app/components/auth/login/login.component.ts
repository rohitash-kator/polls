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
    private readonly apiService: ApiService
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
      console.error('Check your details!!');
      return;
    }
    console.log("From Login Component", this.loginForm.value);
    this.apiService.login(this.loginForm.value).subscribe(
      {
        next: (user) => {
          console.log("Logged In User", user);
        },
        error: (error) => {
          console.error(error);
        },
      }
    );
  }
}
