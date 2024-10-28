import { Component , Input, OnInit ,OnChanges, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent implements OnChanges{
  @Input() city!: string ; // To receive selected city
  @Input() state!: string ; // To receive selected state
  // Add any other relevant inputs
  activeButton: string = 'button1';
  weatherData: any | null = null;
  selectButton(button: string) {
    this.activeButton = button;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['city'] || changes['state']) {
      this.fetchWeatherData();
    }
  }

  fetchWeatherData() {
    // Implement your weather fetching logic here, possibly using a service.
    // For example:
    if (this.city && this.state) {
      console.log(`Fetching weather data for ${this.city}, ${this.state}`);
      // Call your weather service and assign the response to weatherData
      this.weatherData = { temperature: 25, condition: 'Clear' };
    }
  }
}