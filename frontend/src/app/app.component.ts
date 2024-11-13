import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { HttpClient} from '@angular/common/http';
import { HeaderComponent } from './components/partials/header/header.component';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ResultComponent } from './result/result.component';
import { LocationService } from './location.service';
import { HighchartsChartModule } from 'highcharts-angular';
import { GoogleMapsModule } from '@angular/google-maps';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FormsModule, CommonModule,ResultComponent, HighchartsChartModule, GoogleMapsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  city: string = '';
  state: string = '';
  street : string ='';

  constructor(private locationService: LocationService) {
    this.locationService.city$.subscribe(city => this.city = city);
    this.locationService.state$.subscribe(state => this.state = state);
    this.locationService.street$.subscribe(street => this.street = street);
  }
  SearchInitiated(event: { street:string; city: string; state: string }) {
    this.street = event.street;
    this.city = event.city;
    this.state = event.state;
  }
}
