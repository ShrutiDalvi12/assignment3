import { Component, HostListener, OnInit, EventEmitter, Output,} from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent,MatAutocomplete } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { FormControl } from '@angular/forms';
import { Observable , of, from} from 'rxjs';
import { map, startWith ,switchMap,debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { ResultComponent } from '../../../result/result.component';
import { SharedService } from '../../../shared.service';

import { GooglePlacesService } from '../../../google-places.service.js'; 
import { LocationService } from '../../../location.service.js'; 
import { ChangeDetectorRef } from '@angular/core';
import { combineLatest } from 'rxjs';

interface City {
  name: string;
  statename : string;
  place_id: string;
}
interface IpInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  postal: string;
}
//(click)="onSearchInitiated($event)"
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
  streetControl = new FormControl();
  cityControl = new FormControl();
  stateControl = new FormControl();
  filteredCities!: Observable<City[]>; 
  filteredStates!: Observable<string[]>;
  showCityMessage: boolean = false;
  showStreetMessage: boolean = false;
  showStateMessage: boolean = false;
  selectedcity : string ='';
  selectedstate : string ='';
  isLocationDetectionEnabled: boolean = false;
  searchclicked : boolean = false;
  errorMessage1: string = '';
  IPINFO_TOKEN = 'c66e913b7616e3';
   constructor(
    private googlePlacesService: GooglePlacesService,
    private locationService: LocationService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
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
          //this.onSearch();
          //this.sharedService.toggleContentVisibility(true);
        }
      });
    });
  }

//   ngOnInit() {
//   this.filteredCities = this.cityControl.valueChanges.pipe(
//     startWith(''),
//     switchMap(value => this.googlePlacesService.getAutocompleteSuggestions(value)),
//     map(predictions => predictions.map(prediction => ({
//       name: prediction.terms.length > 2 ? prediction.terms[prediction.terms.length - 3].value : '',
//       statename: prediction.terms.length > 2 ? prediction.terms[prediction.terms.length - 2].value : '',
//     } as City)))
//   );

//   this.filteredStates = this.stateControl.valueChanges.pipe(
//     startWith(''),
//     map(value => this._filterStates(value))
//   );

//   combineLatest([this.cityControl.valueChanges, this.stateControl.valueChanges])
//     .pipe(
//       debounceTime(300),
//       distinctUntilChanged(),
//       switchMap(([cityValue, stateValue]) => {
//         // Update the selected city and state
//         this.selectedcity = cityValue;
//         this.selectedstate = stateValue;
//         // Trigger the search
//         this.onSearch();
//         return of([cityValue, stateValue]);
//       })
//     )
//     .subscribe();
// }


  async detectLocation() {
    if (this.isLocationDetectionEnabled) {
      try {
        const response = await fetch(`https://ipinfo.io/json?token=${this.IPINFO_TOKEN}`);
        const data: IpInfo = await response.json();
        
        // Update form controls
        this.street = ''; // Street isn't provided by ipinfo
        this.cityControl.setValue(data.city);
        this.stateControl.setValue(this.getFullStateName(data.region));
        
        // Update selected values
        this.selectedcity = data.city;
        this.selectedstate = this.getFullStateName(data.region);
        console.log(this.selectedcity);
        console.log(this.selectedstate);
        // Disable form controls
        this.streetControl.disable();
        this.cityControl.disable();
        this.stateControl.disable();
        
        // Update location service
        this.locationService.setCity(data.city);
        this.locationService.setState(this.getFullStateName(data.region));
        // Clear validation messages
        this.clearCityMessage();
        this.clearStateMessage();
        
      } catch (error) {
        console.error('Error detecting location:', error);
        this.isLocationDetectionEnabled = false;
      }
    } else {
      // Re-enable form controls
      this.streetControl.enable();
      this.cityControl.enable();
      this.stateControl.enable();
    }
  }
  getFullStateName(stateAbbr: string): string {
    return this.stateMapping[stateAbbr] || stateAbbr;
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

  // onSearch() {
  //   this.searchclicked = true;
  //   if (!this.isLocationDetectionEnabled) {
  //     this.selectedcity = this.city;
  //     this.selectedstate = this.state;
  //     console.log(this.selectedcity);
  //   }
  //   this.searchInitiated.emit({ 
  //     city: this.selectedcity, 
  //     state: this.selectedstate 
  //   });

  //   this.sharedService.toggleContentVisibility(true);
  //   this.cdr.detectChanges();
  // }
  // @Output() searchInitiated = new EventEmitter<{ city: string, state: string }>();
  // onLocationDetectionChange(event: Event) {
  //   const checkbox = event.target as HTMLInputElement;
  //   this.isLocationDetectionEnabled = checkbox.checked;
  //   //this.detectLocation();
  //   this.detectLocation().then(() => {
  //   if (this.isLocationDetectionEnabled) {
  //     this.selectedcity = this.cityControl.value;
  //     this.selectedstate = this.stateControl.value;
  //     // Emit the event once the location is detected
  //     this.onSearch();
  //   }
  // });
  // }

  onSearch() {
    this.searchclicked = true;
    if (!this.isLocationDetectionEnabled) {
      this.selectedcity = this.city;
      this.selectedstate = this.state;
    }else{
      this.detectLocation();
    }
    // Emit the selected city and state
    if(this.selectedcity && this.selectedstate && this.searchclicked){
      this.searchInitiated.emit({ 
      street: this.street,
      city: this.selectedcity, 
      state: this.selectedstate 
    });
    this.errorMessage1 = '';
    this.sharedService.toggleContentVisibility(true);
    this.searchclicked = false;
    //console.log('togggleddd');
  }else{
    console.log('sorry error occurred');
    this.errorMessage1 = 'Sorry, an error occurred. Please try again.'; 
  }
    // this.searchInitiated.emit({ 
    //   city: this.selectedcity, 
    //   state: this.selectedstate 
    // });
    // this.sharedService.toggleContentVisibility(true);
  }

  @Output() searchInitiated = new EventEmitter<{ street:string, city: string, state: string }>();

  onLocationDetectionChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.isLocationDetectionEnabled = checkbox.checked;
    //this.detectLocation();
  }
    clearForm() {
    // Clear input values
    this.street = '';
    this.cityControl.setValue('');
    this.stateControl.setValue('');
    // Reset selected values
    this.selectedcity = '';
    this.selectedstate = '';
    this.searchclicked = false;
    // Clear validation messages
    this.showStreetMessage = false;
    this.showCityMessage = false;
    this.showStateMessage = false;
    // this.showResults = false;
    this.errorMessage1='';
    this.sharedService.toggleContentVisibility(false);
    // If location detection was enabled, disable it
    if (this.isLocationDetectionEnabled) {
      this.isLocationDetectionEnabled = false;
      
      // Re-enable the form controls
      this.streetControl.enable()
      this.cityControl.enable();
      this.stateControl.enable();
    }
    
    // Reset the checkbox if it exists in the DOM
    const checkbox = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }
    
    // Reset location service values
    this.locationService.setCity('');
    this.locationService.setState('');
  }
}

