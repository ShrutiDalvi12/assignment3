import { Component, Input, OnChanges, OnInit, SimpleChanges, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { WeatherService } from '../weather.service';
import { SharedService } from '../shared.service';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { isPlatformBrowser } from '@angular/common';
import HC_more from 'highcharts/highcharts-more';
import Windbarb from 'highcharts/modules/windbarb';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FavoriteService } from '../favorite.service';
import { WeatherImageService } from '../weather-image.service';

// Define interfaces for type safety
interface WeatherInterval {
  startTime: string;
  values: {
    temperatureMax?: number;
    temperatureMin?: number;
    temperature?: number;
    humidity?: number;
    windSpeed?: number;
    windDirection?: number;
    pressureSeaLevel? : number;
  };
}

interface TemperatureRange {
  forecast: {
    intervals: WeatherInterval[];
  };
}

interface HourlyData {
  hourly: {
    intervals: WeatherInterval[];
  };
}

export enum ButtonType {
  Button1 = 'button1',
  Button2 = 'button2',
}

export enum TabType {
  DayView = 'dayView',
  DailyTemp = 'dailyTemp',
  Meteogram = 'meteogram',
}

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule, GoogleMapsModule],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
   animations: [
    trigger('slideTransition', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(-100%)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class ResultComponent implements OnChanges, OnInit {
  @Input() city!: string;
  @Input() state!: string;
  
  readonly ButtonType = ButtonType;
  readonly TabType = TabType;
  
  activeButton: ButtonType = ButtonType.Button1;
  weatherData: any | null = null;
  hourlyData: HourlyData | null = null;
  temperatureRange: TemperatureRange | null = null;
  activeTab: TabType = TabType.DayView;
  showContent: boolean = false;
  private dates: string[] = [];
  private maxTemps: number[] = [];
  private minTemps: number[] = [];
  isStarred = false;
  selectedDay: any;
  lat: number = 0;  
  lon: number = 0;  
  zoom: number = 15; 
  markerPosition = { lat: this.lat, lng: this.lon };
  errorMessage: string = '';
  iserror : boolean = false;
  loading: boolean = false;
  today: Date = new Date();
  favorites: any[] = []; 
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions1: Highcharts.Options = {};
  chartOptions2: Highcharts.Options = {};
  showFavourites : boolean = false;
  weatherImage: [string, string] = ["assets/images/Weather Symbols for Weather Codes/clear_day.svg","Clear, Sunny"];
  constructor(
    private weatherService: WeatherService,
    private sharedService: SharedService,
    private favoriteService: FavoriteService,
    private weatherImageService: WeatherImageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      HC_more(Highcharts);
      Windbarb(Highcharts);
      this.initializeGoogleMaps();
    }
  }

  initializeGoogleMaps(){
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCiJJRL9f7UyhZaDDc6NNlEfMWf-LU7er0&libraries=places';
    script.defer = true;
    document.head.appendChild(script);
  }

  selectButton(button: ButtonType): void {
    this.activeButton = button;
    if (button === 'button1' && this.iserror) {
      this.errorMessage = 'An error occurred. Please try again later.';
    } else if (button === 'button2') {
      this.iserror=false;
      this.fetchFavorites();
      this.showFavourites=true;
    }
  }
  toggleStar() {
    this.isStarred = !this.isStarred;
    if (this.isStarred) {
      console.log(this.city);
      console.log(this.state);
      this.favoriteService.saveFavorite(this.city, this.state).then(
        response => {
          console.log('City and state saved:', response);
        },
        error => {
          console.error('Error saving favorite:', error);
        }
      );
      this.fetchFavorites();
    }
  }
  selectDay(day: any) {
    this.selectedDay = day;
    console.log(day);
    this.showContent = false;
  }
  showprevious(){
    this.selectedDay = null;  
    this.activeButton = ButtonType.Button1; 
    this.showContent = true; 
  }
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.sharedService.showContent$.subscribe(show => {
        this.showContent = show;
      });
      if (this.city && this.state) {
        this.fetchWeatherData();
        //this.showContent=true;
      }
    }
    this.errorMessage = '';
    this.fetchFavorites(); 
    this.showFavourites=false;
  }
  
 getWeatherImg(code: number): string {
  const [imgPath] = this.weatherImageService.imgMap(code); 
  return imgPath;
}
getWeatherType(code: number):string{
  const [_,weatherType] = this.weatherImageService.imgMap(code); 
  return weatherType;
}
  private processWeatherData(): void {
    console.log("hit processweather");
    if (!this.temperatureRange?.forecast?.intervals) {
      console.error("Invalid weather data format");
      return;
    }

    // Clear existing arrays
    this.dates = [];
    this.maxTemps = [];
    this.minTemps = [];

    this.temperatureRange.forecast.intervals.forEach((day: WeatherInterval) => {
      const date = new Date(day.startTime).toISOString().split('T')[0];
      
      if (typeof day.values.temperatureMax === 'number' && 
          typeof day.values.temperatureMin === 'number') {
        this.dates.push(date);
        this.maxTemps.push(day.values.temperatureMax);
        this.minTemps.push(day.values.temperatureMin);
      }
    });

    if (this.dates.length > 0) {
      this.displayChart1(this.dates, this.maxTemps, this.minTemps);
      this.createMeteogramChart();
    }
  }

  displayChart1(dates: string[], temperatureMaxSeries: number[], temperatureMinSeries: number[]): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const temperatureSeries = dates.map((date, index) => {
      return [Date.parse(date), temperatureMinSeries[index], temperatureMaxSeries[index]];
    });

    this.chartOptions1 = {
      chart: {
        type: 'arearange',
        scrollablePlotArea: {
          minWidth: 600,
          scrollPositionX: 1
        },
        animation: {
          duration: 3000,
          easing: 'easeOutBounce'
        }
      },
      title: {
        text: 'Temperature Ranges (Min, Max)'
      },
      xAxis: {
        type: 'datetime',
        accessibility: {
          rangeDescription: 'Temperature for 5 days'
        }
      },
      yAxis: {
        title: {
          text: 'Temperature (°F)'
        }
      },
      tooltip: {
        shared: true,
        valueSuffix: '°F',
        xDateFormat: '%A, %b %e'
      },
      legend: {
        enabled: false
      },
      series: [{
        type: 'arearange',
        name: 'Temperatures',
        data: temperatureSeries,
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, '#ff7f00'],
            [1, '#87ceeb']
          ]
        }
      } as Highcharts.SeriesArearangeOptions]
    };
  }

    createMeteogramChart(): void {
    if (!this.hourlyData?.hourly?.intervals || !isPlatformBrowser(this.platformId)) return;

    const intervals = this.hourlyData.hourly.intervals;
    
    const temperatureSeries = intervals.map(entry => [
      Date.parse(entry.startTime),
      entry.values.temperature
    ]).filter((point): point is [number, number] => 
      typeof point[1] === 'number'
    );

    const humiditySeries = intervals.map(entry => [
      Date.parse(entry.startTime),
      entry.values.humidity
    ]).filter((point): point is [number, number] => 
      typeof point[1] === 'number'
    );

    const PressureSeries = intervals.map(entry => [
      Date.parse(entry.startTime),
      entry.values.pressureSeaLevel
    ]).filter((point): point is [number, number] => 
      typeof point[1] === 'number'
    );

    const windBarbsSeries = intervals.map(entry => ({
      x: Date.parse(entry.startTime),
      value: entry.values.windSpeed ?? 0,
      direction: entry.values.windDirection ?? 0
    }));

    this.chartOptions2 = {
      chart: {
        type: 'spline',
        animation: { duration: 2000, easing: 'easeOutBounce' },
        alignTicks: false,
        marginBottom: 100  // Add more margin at bottom for wind barbs
      },
      title: { text: 'Hourly Weather (For the next 5 days)' },
      xAxis: [{
        type: 'datetime',
        tickInterval: 24 * 3600 * 1000,
        accessibility: { rangeDescription: 'Hourly weather data' },
        opposite: true
      }, {
        // Secondary x-axis for wind barbs
        type: 'datetime',
        linkedTo: 0,
        opposite: false,
        offset: 40,  // Offset from bottom
        tickLength: 0,
        gridLineWidth: 0,
        labels: { enabled: false }
      }],
      yAxis: [
        { 
          // Temperature axis
          
          title: { text: '' },
          opposite: false
        },
        { 
          // Humidity axis
          
          title: { text: '' },
          opposite: true,
          allowDecimals: false
        },
        { 
          // Pressure axis
          
          title: { text: '' },
          opposite: true
        },
        { 
          // Wind axis
          
          title: { text: '' },
          opposite: false,
          gridLineWidth: 0,
          min: 0
        }
      ],
      tooltip: { 
        shared: true, 
        xDateFormat: '%A, %b %e %H:%M',
        formatter: function(this: Highcharts.TooltipFormatterContextObject): string {
          if (!this.points) return '';
          
          const xValue = typeof this.x === 'number' ? this.x :
                        typeof this.x === 'string' ? Date.parse(this.x) : 
                        null;
          
          const date = xValue !== null ? Highcharts.dateFormat('%A, %b %e %H:%M', xValue) : '';
          let tooltip = `<b>${date}</b><br/>`;
          
          this.points.forEach(point => {
            if (typeof point.y === 'number') {
              const value = point.y.toFixed(1);
              const units = point.series.name === 'Temperature' ? '°F' :
                           point.series.name === 'Humidity' ? '%' :
                           point.series.name === 'Pressure' ? ' inHg' :
                           point.series.name === 'Wind Speed' ? ' mph' :
                           '';
              tooltip += `${point.series.name}: <b>${value}${units}</b><br/>`;
            }
          });
          
          return tooltip;
        }
      },
      series: [
        {
          name: 'Temperature',
          data: temperatureSeries,
          color: 'red',
          yAxis: 0,
          type: 'spline',
          zIndex: 2,
          marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            },
        },
        {
          name: 'Humidity',
          data: humiditySeries,
          color: '#68CFE8',
          yAxis: 0,
          type: 'column',
          zIndex: 1,
          dataLabels: {
                enabled: true, // Enable data labels for humidity
                style: {
                    fontSize: '8px',
                    color: 'gray'
                }
            },
        },
        {
          name: 'Pressure',
          data: PressureSeries,
          color: 'orange',  // Changed color to distinguish from humidity
          yAxis: 2,
          type: 'spline',
          zIndex: 1,
          marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            },
        },
        {
          name: 'Wind',
          type: 'windbarb',
          data: windBarbsSeries,
          color: 'blue',
          yAxis: 3,
          xAxis: 1,  // Use secondary x-axis
          zIndex: 3
        } as Highcharts.SeriesWindbarbOptions
      ]
    };
}
    ngOnChanges(changes: SimpleChanges) {
    if (changes['city'] || changes['state']) {
      this.clear();
      this.errorMessage = '';
      this.showContent = false;
      this.showFavourites=false;
      if (this.city && this.state) {
      this.iserror=false;
      this.fetchWeatherData();
    }
    }
    
  }
  async clear(){
    this.selectedDay = false;
    this.iserror=false;
    this.isStarred = false;
    this.activeButton = ButtonType.Button1;
  }

  showfavdata(favoritecity:string, favoritestate:string){
    this.city = favoritecity;
    this.state=favoritestate;
    this.activeButton= ButtonType.Button1;
  }
  async fetchWeatherData() {
    if (!this.city || !this.state) {
    this.showContent = false;
    this.iserror = true;
    this.errorMessage = "Please enter valid city and state values.";
    this.loading = false;
    console.log("nocitystate");
    return;}

    try {
      console.log("hit fetchweather1");
      this.loading = true;
      const coordResponse = await this.weatherService.getCoordinates(this.city, this.state);
      console.log("hit fetchweather2");
      if (!coordResponse?.lat || !coordResponse?.lon) {
        console.log('wrong city and state');
        throw new Error('Invalid coordinates received');
      }

      const { lat, lon } = coordResponse;
      this.lat = lat;
      this.lon = lon;

      const weatherData = await (
      this.weatherService.getDailyForecast(lat, lon));

      this.weatherData = weatherData;
      this.temperatureRange = weatherData;
      this.hourlyData = weatherData;
      this.processWeatherData();
      this.sharedService.toggleContentVisibility(true);
      this.loading = false;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      this.errorMessage = 'An error occurred. Please try again later.';
      console.log("hit fetchweather3");
      this.iserror=true;
      this.loading = false; 
    }
  }
  details(){
    if (!this.selectedDay) {
      this.showContent=false;
      this.selectedDay = this.weatherData?.forecast?.intervals?.find(
        (day: any) => new Date(day.startTime).toDateString() === this.today.toDateString()
      );
    }
  }
  

  tweetWeather(): void {
    if (!this.weatherData || !this.city || !this.state) {
      console.error("Weather data is incomplete or missing city/state.");
      return;
    }
    const temperature = this.selectedDay.values.temperature; 
    const summary = this.getWeatherType(this.selectedDay.values.weatherCode);
    const date = new Date(this.selectedDay.startTime); 
    // Format the day of the week and date (e.g., "Monday, October 30, 2023")
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const tweetContent = `The temperature in ${this.city}, ${this.state} on ${dayOfWeek}, ${formattedDate} is ${temperature}. The weather conditions are ${summary}. #CSCI571WeatherSearch`;

    const encodedTweet = encodeURIComponent(tweetContent);

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTweet}`;
    window.open(twitterUrl, '_blank');
  }
  fetchFavorites(): void {
    fetch('http://localhost:3000/api/getfavorites')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        this.favorites = data; 
        this.loading = false;  
      })
      .catch(error => {
        this.errorMessage = 'Failed to load favorites.';
        this.loading = false;
        console.error('Error fetching favorites:', error);
      });
  }
  deleteFavorite(city: string): void {
        fetch(`http://localhost:3000/api/deletefavorite/${city}`, { method: 'DELETE' })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to delete favorite');
                }
                // Filter out the deleted favorite from the list
                this.favorites = this.favorites.filter(fav => fav.city !== city);
                console.log('Favorite deleted successfully');
            })
            .catch((error) => {
                console.error('Error deleting favorite:', error);
                this.errorMessage = 'Could not delete favorite';
            });
}
}



