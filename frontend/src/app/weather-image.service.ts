import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherImageService {

  private imgMapping: { [key: number]: [string, string] } = {
    1000: ["assets/Weather Symbols for Weather Codes/clear_day.svg", "Clear, Sunny"],
    1100: ["assets/Weather Symbols for Weather Codes/mostly_clear_day.svg", "Mostly Clear"],
    1101: ["assets/Weather Symbols for Weather Codes/partly_cloudy_day.svg", "Partly Cloudy"],
    1102: ["assets/Weather Symbols for Weather Codes/mostly_cloudy.svg", "Mostly Cloudy"],
    1001: ["assets/Weather Symbols for Weather Codes/cloudy.svg", "Cloudy"],
    2000: ["assets/Weather Symbols for Weather Codes/fog.svg", "Fog"],
    2100: ["assets/Weather Symbols for Weather Codes/fog_light.svg", "Light Fog"],
    4000: ["assets/Weather Symbols for Weather Codes/drizzle.svg", "Drizzle"],
    4001: ["assets/Weather Symbols for Weather Codes/rain.svg", "Rain"],
    4200: ["assets/Weather Symbols for Weather Codes/rain_light.svg", "Light Rain"],
    4201: ["assets/Weather Symbols for Weather Codes/rain_heavy.svg", "Heavy Rain"],
    5000: ["assets/Weather Symbols for Weather Codes/snow.svg", "Snow"],
    5001: ["assets/Weather Symbols for Weather Codes/flurries.svg", "Flurries"],
    5100: ["assets/Weather Symbols for Weather Codes/snow_light.svg", "Light Snow"],
    5101: ["assets/Weather Symbols for Weather Codes/snow_heavy.svg", "Heavy Snow"],
    6000: ["assets/Weather Symbols for Weather Codes/freezing_drizzle.svg", "Freezing Drizzle"],
    6001: ["assets/Weather Symbols for Weather Codes/freezing_rain.svg", "Freezing Rain"],
    6200: ["assets/Weather Symbols for Weather Codes/freezing_rain_light.svg", "Light Freezing Rain"],
    6201: ["assets/Weather Symbols for Weather Codes/freezing_rain_heavy.svg", "Heavy Freezing Rain"],
    7000: ["assets/Weather Symbols for Weather Codes/ice_pellets.svg", "Ice Pellets"],
    7101: ["assets/Weather Symbols for Weather Codes/ice_pellets_heavy.svg", "Heavy Ice Pellets"],
    7102: ["assets/Weather Symbols for Weather Codes/ice_pellets_light.svg", "Light Ice Pellets"],
    8000: ["assets/Weather Symbols for Weather Codes/thunderstorm.svg", "Thunderstorm"]
  };

  imgMap(code: number): [string, string] {
    return this.imgMapping[code] || ["", "Unknown"];
  }
}
