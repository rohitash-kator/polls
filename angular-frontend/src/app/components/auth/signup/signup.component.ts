import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  enteredFirstName: string = '';
  enteredLastName: string = '';
  enteredEmail: string = '';
  enteredPassword: string = '';
  enteredConfirmPassword = '';

  constructor(private readonly router: Router) {}

  onSignup() {
    console.log('Signup Clicked!1');
    this.router.navigate(['/login']);
  }
}
