import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

// GOOGLE_MAPS_API_KEY='AIzaSyC2qqTgT2VvCctWuPjS3L4OUjUUZBjV5Lw'
export class WeatherService {
  private apiUrl = environment.apiUrl; // e.g., 'http://localhost:3000/api/weather'
  private googleMapsApiKey = 'AIzaSyC2qqTgT2VvCctWuPjS3L4OUjUUZBjV5Lw'; // Your Google Maps API key

  constructor() {}

  // Method to get daily weather forecast based on latitude and longitude
  async getDailyForecast(lat: number, lon: number): Promise<any> {
    const response = await fetch(`${this.apiUrl}?lat=${lat}&long=${lon}`);
    if (!response.ok) {
      throw new Error('Failed to fetch daily forecast');
    }
    return response.json();
  }

  // async getHourlyForecast(lat: number, lon: number): Promise<any> {
  //   const response = await fetch(`${this.apiUrl}?lat=${lat}&long=${lon}`);
  //   if (!response.ok) {
  //     throw new Error('Failed to fetch hourly forecast');
  //   }
  //   return response.json();
  // }

  // async getTemperatureRange(lat: number, lon: number): Promise<any> {
  //   const response = await fetch(`${this.apiUrl}?lat=${lat}&long=${lon}`);
  //   if (!response.ok) {
  //     throw new Error('Failed to fetch temperature range');
  //   }
  //   return response.json();
  // }

  async getCoordinates(street:string, city: string, state: string): Promise<any> {
    const address = `${street},${city}, ${state}`;
    console.log(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.googleMapsApiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch coordinates');
    }
    const data = await response.json();
    
    // Check if any results are returned
    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      const address = data.results[0].formatted_address;
      console.log(data);
      //const { address } 
      return { lat, lon: lng, address : address};
    } else {
      throw new Error('No results found for the specified location');
    }
  }
}
