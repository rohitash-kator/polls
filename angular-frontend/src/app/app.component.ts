import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { LoaderComponent } from './components/shared/loader/loader.component';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Poll Management App';
  isLoading: boolean = true;
  constructor(private readonly apiService: ApiService) {
    this.apiService.isLoading.subscribe((loading) => {
      this.isLoading = loading;
    });
  }
}
