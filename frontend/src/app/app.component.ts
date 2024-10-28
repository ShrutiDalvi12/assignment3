import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/partials/header/header.component';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ResultComponent } from './result/result.component';
import { LocationService } from './location.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FormsModule, CommonModule,ResultComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  city: string = '';
  state: string = '';

  constructor(private locationService: LocationService) {
    this.locationService.city$.subscribe(city => this.city = city);
    this.locationService.state$.subscribe(state => this.state = state);
  }
}
