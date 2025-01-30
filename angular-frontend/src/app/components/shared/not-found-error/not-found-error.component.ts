import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found-error',
  imports: [MatButtonModule, MatCardModule, RouterModule],
  templateUrl: './not-found-error.component.html',
  styleUrl: './not-found-error.component.css',
})
export class NotFoundErrorComponent {}
