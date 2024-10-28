import { Component, HostListener, OnInit, EventEmitter, Output,} from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent,MatAutocomplete } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { FormControl } from '@angular/forms';
import { Observable , of, from} from 'rxjs';
import { map, startWith ,switchMap,debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { ResultComponent } from '../../../result/result.component';

import { GooglePlacesService } from '../../../google-places.service.js'; 
import { LocationService } from '../../../location.service.js'; 
interface City {
  name: string;
  statename : string;
  place_id: string;
}
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatAutocompleteModule, MatInputModule, ResultComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})



export class HeaderComponent implements OnInit {
  street: string = '';
  city: string = '';
  state: string = '';
  states: string[] = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
    'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
    'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  cityControl = new FormControl();
  stateControl = new FormControl();
  filteredCities!: Observable<City[]>; 
  filteredStates!: Observable<string[]>;
  showCityMessage: boolean = false;
  showStreetMessage: boolean = false;
  showStateMessage: boolean = false;
  selectedcity : string ='';
  selectedstate : string ='';
   constructor(
    private googlePlacesService: GooglePlacesService,
    private locationService: LocationService
  ) {}
  ngOnInit() {

    this.filteredCities = this.cityControl.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.googlePlacesService.getAutocompleteSuggestions(value)),
      map(predictions => predictions.map(prediction => ({
        name: prediction.terms.length>2 ? prediction.terms[prediction.terms.length - 3].value : '',
        statename : prediction.terms.length>2 ? prediction.terms[prediction.terms.length - 2].value : '',
      } as City))) 
    );

    this.filteredStates = this.stateControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStates(value))
    );

    this.cityControl.valueChanges.subscribe(value => {
      this.filteredCities.subscribe(cities => {
        const selectedCity = cities.find(c => c.name === value);
        console.log(selectedCity);
        if (selectedCity) {
          this.onCitySelected(selectedCity.statename); 
          this.selectedcity = selectedCity.name;
          this.selectedstate = selectedCity.statename;
          this.locationService.setCity(selectedCity.name);
          this.locationService.setState(selectedCity.statename);
        }
      });
    });
  }

  private _filterStates(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.states.filter(state => state.toLowerCase().includes(filterValue));
  }

  private stateMapping: { [key: string]: string } = {
  'AL': 'Alabama',
  'AK': 'Alaska',
  'AZ': 'Arizona',
  'AR': 'Arkansas',
  'CA': 'California',
  'CO': 'Colorado',
  'CT': 'Connecticut',
  'DE': 'Delaware',
  'FL': 'Florida',
  'GA': 'Georgia',
  'HI': 'Hawaii',
  'ID': 'Idaho',
  'IL': 'Illinois',
  'IN': 'Indiana',
  'IA': 'Iowa',
  'KS': 'Kansas',
  'KY': 'Kentucky',
  'LA': 'Louisiana',
  'ME': 'Maine',
  'MD': 'Maryland',
  'MA': 'Massachusetts',
  'MI': 'Michigan',
  'MN': 'Minnesota',
  'MS': 'Mississippi',
  'MO': 'Missouri',
  'MT': 'Montana',
  'NE': 'Nebraska',
  'NV': 'Nevada',
  'NH': 'New Hampshire',
  'NJ': 'New Jersey',
  'NM': 'New Mexico',
  'NY': 'New York',
  'NC': 'North Carolina',
  'ND': 'North Dakota',
  'OH': 'Ohio',
  'OK': 'Oklahoma',
  'OR': 'Oregon',
  'PA': 'Pennsylvania',
  'RI': 'Rhode Island',
  'SC': 'South Carolina',
  'SD': 'South Dakota',
  'TN': 'Tennessee',
  'TX': 'Texas',
  'UT': 'Utah',
  'VT': 'Vermont',
  'VA': 'Virginia',
  'WA': 'Washington',
  'WV': 'West Virginia',
  'WI': 'Wisconsin',
  'WY': 'Wyoming'
};

@Output() searchInitiated = new EventEmitter<{ city: string, state: string }>();



  onCitySelected(statename: string) {
  const longStateName = this.stateMapping[statename]; 
  
  if (longStateName) {
    this.stateControl.setValue(longStateName);
    
    this.clearStateMessage();
  } else {
    console.warn(`No mapping found for state: ${statename}`);
  }
}

selectCity(city: City) {
  console.log(city); 
  this.city = city.name; 
  this.state = city.statename;
  this.onCitySelected(city.statename); 
}
  

  validateStreet() {
    this.showStreetMessage = this.street.length === 0;
  }

  validateCity(value: string = '') {
    this.showCityMessage = !value || value.length === 0;
  }

  validateState(value: string = '') {
    this.showStateMessage = !value || value.length === 0;
  }

  clearStreetMessage() {
    if (this.street.length > 0) {
      this.showStreetMessage = false;
    }
  }

  clearCityMessage() {
    if (this.cityControl.value && this.cityControl.value.length > 0) {
      this.showCityMessage = false;
    }
  }

  clearStateMessage() {
    if (this.stateControl.value && this.stateControl.value.length > 0) {
      this.showStateMessage = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    const cityInputElement = document.getElementById('city');
    const stateInputElement = document.getElementById('state');
    const cityDropdownElement = document.querySelector('.city-autocomplete-panel'); 
    const stateDropdownElement = document.querySelector('.state-autocomplete-panel'); 

    if (cityInputElement && !cityInputElement.contains(targetElement) &&
        cityDropdownElement && !cityDropdownElement.contains(targetElement)) {
      this.filteredCities = of([]);
    }

    if (stateInputElement && !stateInputElement.contains(targetElement) &&
        stateDropdownElement && !stateDropdownElement.contains(targetElement)) {
      this.filteredStates = of([]);
    }
  }
  
  onSearch() {
    // Emit the selected city and state
    // this.searchInitiated.emit({ city: this.selectedcity, state: this.selectedstate });
    this.selectedcity = this.city; 
    this.selectedstate = this.state;
  }
}