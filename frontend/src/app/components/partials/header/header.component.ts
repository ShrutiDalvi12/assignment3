import { Component, HostListener, OnInit} from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent,MatAutocomplete } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { FormControl } from '@angular/forms';
import { Observable , of, from} from 'rxjs';
import { map, startWith ,switchMap} from 'rxjs/operators';

import { GooglePlacesService } from '../../../google-places.service.js'; 
interface City {
  name: string;
  statename : string;
  place_id: string;
}
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatAutocompleteModule, MatInputModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

// export class HeaderComponent {
//   street: string = '';
//   city: string = '';
//   state: string = '';
//   states: string[] = [
//     'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
//     'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
//     'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
//     'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
//     'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
//     'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
//     'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
//     'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
//     'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
//     'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
//   ];

//   stateControl = new FormControl();
//   filteredStates!: Observable<string[]>;

//   showStateMessage: boolean = false;

//   // filteredStates: string[] = []; 
//   showStreetMessage: boolean = false;
//   showCityMessage: boolean = false;
//   // showStateMessage: boolean = false;
//   ngOnInit() {
//     // Set up the filtering logic
//     this.filteredStates = this.stateControl.valueChanges.pipe(
//       startWith(''),
//       map(value => this._filterStates(value))
//     );

//     this.stateControl.valueChanges.subscribe(value => {
//       this.validateState(value);
//     });
//   }

//   private _filterStates(value: string): string[] {
//     const filterValue = value.toLowerCase();
//     return this.states.filter(state => state.toLowerCase().includes(filterValue));
//   }

//   validateStreet() {
//     this.showStreetMessage = this.street.length === 0;
//   }

//   validateCity() {
//     this.showCityMessage = this.city.length === 0;
//   }

//   validateState(value:string = '') {
//     this.showStateMessage = value.length === 0;
//   }

//   // filterStates() {
//   //   const input = this.state.toLowerCase();
//   //   this.filteredStates = this.states.filter(state => 
//   //     state.toLowerCase().includes(input)
//   //   );

//   //   this.showStateMessage = input.length === 0;
//   // }

//   clearStreetMessage() {
//     if (this.street.length > 0) {
//       this.showStreetMessage = false;
//     }
//   }

//   clearCityMessage() {
//     if (this.city.length > 0) {
//       this.showCityMessage = false;
//     }
//   }

//   clearStateMessage() {
//     if (this.stateControl.value && this.stateControl.value.length > 0) {
//       this.showStateMessage = false;
//     }
//   }

//   // selectState(state: string) {
//   //   this.state = state;
//   //   this.filteredStates = []; 
//   //   this.showStateMessage = false; 
//   // }
//   @HostListener('document:click', ['$event'])
//   onClickOutside(event: Event) {
//     const targetElement = event.target as HTMLElement;
//     const inputElement = document.getElementById('state');
//     const dropdownElement = document.querySelector('.mat-autocomplete-panel');

//     if (inputElement && !inputElement.contains(targetElement) &&
//         dropdownElement && !dropdownElement.contains(targetElement)) {
//       // If click is outside the input and dropdown, clear filteredStates
//       this.filteredStates = new Observable<string[]>((observer) => {
//         observer.next([]); // Empty array to close dropdown
//       });
//     }
//   }
// }

// export class HeaderComponent implements OnInit {
//   street: string = '';
//   city: string = '';
//   state: string = '';
//   states: string[] = [
//     'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
//     'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
//     'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
//     'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
//     'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
//     'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
//     'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
//     'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
//     'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
//     'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
//   ];

//   cityControl = new FormControl();
//   stateControl = new FormControl();
//   filteredCities!: Observable<any[]>;
//   filteredStates!: Observable<string[]>;

//   showCityMessage: boolean = false;
//   showStateMessage: boolean = false;
//   showStreetMessage: boolean = false;

//   constructor(private googlePlacesService: GooglePlacesService) {}

//   ngOnInit() {
//     // Set up city autocomplete
//     this.filteredCities = this.cityControl.valueChanges.pipe(
//       startWith(''),
//       switchMap(value => this.googlePlacesService.getCitySuggestions(value))
//     );

//     // Set up state autocomplete
//     this.filteredStates = this.stateControl.valueChanges.pipe(
//       startWith(''),
//       map(value => this._filterStates(value))
//     );

//     this.cityControl.valueChanges.subscribe(value => {
//       this.showCityMessage = value.length === 0;
//     });

//     this.stateControl.valueChanges.subscribe(value => {
//       this.validateState(value);
//     });
//   }

//   private _filterStates(value: string): string[] {
//     const filterValue = value.toLowerCase();
//     return this.states.filter(state => state.toLowerCase().includes(filterValue));
//   }

//   validateStreet() {
//     this.showStreetMessage = this.street.length === 0;
//   }
//   validateCity() {
//     this.showCityMessage = this.cityControl.value.length === 0;
//   }

//   validateState(value: string = '') {
//     this.showStateMessage = value.length === 0;
//   }

//   clearCityMessage() {
//     if (this.cityControl.value && this.cityControl.value.length > 0) {
//       this.showCityMessage = false;
//     }
//   }

//   clearStateMessage() {
//     if (this.stateControl.value && this.stateControl.value.length > 0) {
//       this.showStateMessage = false;
//     }
//   }

//   clearStreetMessage() {
//     if (this.street.length > 0) {
//       this.showStreetMessage = false;
//     }
//   }

//   @HostListener('document:click', ['$event'])
//   onClickOutside(event: Event) {
//     const targetElement = event.target as HTMLElement;
//     const cityInputElement = document.getElementById('city');
//     const stateInputElement = document.getElementById('state');
//     const cityDropdownElement = document.querySelector('.mat-autocomplete-panel[aria-hidden="false"]');
//     const stateDropdownElement = document.querySelector('.mat-autocomplete-panel[aria-hidden="false"]');

//     // Close dropdown if clicked outside the inputs and dropdowns
//     if (
//       (cityInputElement && !cityInputElement.contains(targetElement) && !cityDropdownElement) ||
//       (stateInputElement && !stateInputElement.contains(targetElement) && !stateDropdownElement)
//     ) {
//       this.filteredStates = new Observable<string[]>((observer) => {
//         observer.next([]); // Empty array to close dropdown
//       });
//     }
//   }

// }

// export class HeaderComponent implements OnInit {
//   street: string = '';
//   city: string = '';
//   state: string = '';
//   states: string[] = [
//     'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
//     'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
//     'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
//     'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
//     'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
//     'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
//     'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
//     'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
//     'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
//     'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
//   ];

//   cityControl = new FormControl();
//   stateControl = new FormControl();
//   filteredCities!: Observable<any[]>; // Type as per your API response
//   filteredStates!: Observable<string[]>;
//   showCityMessage: boolean = false;
//   showStreetMessage: boolean = false;
//   showStateMessage: boolean = false;

//   constructor(private googlePlacesService: GooglePlacesService) {}

//   ngOnInit() {
//     // Set up the filtering logic for city
//     this.filteredCities = this.cityControl.valueChanges.pipe(
//         startWith(''),
//         switchMap(value => this.googlePlacesService.getAutocompleteSuggestions(value)) // Use switchMap here
//     );

//     // Set up the filtering logic for state
//     this.filteredStates = this.stateControl.valueChanges.pipe(
//         startWith(''),
//         map(value => this._filterStates(value))
//     );

//     this.cityControl.valueChanges.subscribe(value => {
//         this.validateCity(value);
//     });

//     this.stateControl.valueChanges.subscribe(value => {
//         this.validateState(value);
//     });
// }

//   private _filterCities(value: string): Observable<any[]> {
//     if (value.length < 2) {
//         // Return an empty observable if the input length is less than 2
//         return of([]); // Using `of` to create an observable from the empty array
//     }

//     // Call the service method and return its observable
//      return from(this.googlePlacesService.getAutocompleteSuggestions(value)).pipe(
//             map(predictions => predictions.map(prediction => prediction.description)) // Adjust as necessary based on your API response
//         );
//     }

//   private _filterStates(value: string): string[] {
//     const filterValue = value.toLowerCase();
//     return this.states.filter(state => state.toLowerCase().includes(filterValue));
//   }

//   validateStreet() {
//     this.showStreetMessage = this.street.length === 0;
//   }

//   validateCity(value: string = '') {
//     this.showCityMessage = value.length === 0;
//   }

//   validateState(value: string = '') {
//     this.showStateMessage = value.length === 0;
//   }

//   clearStreetMessage() {
//     if (this.street.length > 0) {
//       this.showStreetMessage = false;
//     }
//   }

//   clearCityMessage() {
//     if (this.cityControl.value && this.cityControl.value.length > 0) {
//       this.showCityMessage = false;
//     }
//   }

//   clearStateMessage() {
//     if (this.stateControl.value && this.stateControl.value.length > 0) {
//       this.showStateMessage = false;
//     }
//   }

//   @HostListener('document:click', ['$event'])
//   onClickOutside(event: Event) {
//     const targetElement = event.target as HTMLElement;
//     const cityInputElement = document.getElementById('city'); // Ensure this ID matches your input element
//     const stateInputElement = document.getElementById('state'); // Ensure this ID matches your input element
//     const cityDropdownElement = document.querySelector('.mat-autocomplete-panel');
//     const stateDropdownElement = document.querySelector('.mat-autocomplete-panel');

//     // If click is outside the city input and dropdown, clear filteredCities
//     if (cityInputElement && !cityInputElement.contains(targetElement) &&
//         cityDropdownElement && !cityDropdownElement.contains(targetElement)) {
//       this.filteredCities = new Observable(observer => {
//         observer.next([]); // Empty array to close dropdown
//         observer.complete();
//       });
//     }

//     // If click is outside the state input and dropdown, clear filteredStates
//     if (stateInputElement && !stateInputElement.contains(targetElement) &&
//         stateDropdownElement && !stateDropdownElement.contains(targetElement)) {
//       this.filteredStates = new Observable(observer => {
//         observer.next([]); // Empty array to close dropdown
//         observer.complete();
//       });
//     }
//   }
// }

// export class HeaderComponent implements OnInit {
//   street: string = '';
//   city: string = '';
//   state: string = '';
//   states: string[] = [
//     'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
//     'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
//     'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
//     'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
//     'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
//     'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
//     'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
//     'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
//     'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
//     'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
//   ];
  
  
//   cityControl = new FormControl();
//   stateControl = new FormControl();
//   filteredCities!: Observable<string[]>; 
//   filteredStates!: Observable<string[]>;
//   showCityMessage: boolean = false;
//   showStreetMessage: boolean = false;
//   showStateMessage: boolean = false;
//   selectedCity: any;
//   constructor(private googlePlacesService: GooglePlacesService) {}

//   // ngOnInit() {
//   //   // Set up the filtering logic for city
//   //   this.filteredCities = this.cityControl.valueChanges.pipe(
//   //     startWith(''),
//   //     switchMap(value => value.length > 1 
//   //       ? this._filterCities(value) 
//   //       : of([])) // Ensure at least 2 characters before triggering API
//   //   );

//   //   // Set up the filtering logic for state
//   //   this.filteredStates = this.stateControl.valueChanges.pipe(
//   //     startWith(''),
//   //     map(value => this._filterStates(value))
//   //   );

//   //   this.cityControl.valueChanges.subscribe(value => {
//   //     this.validateCity(value);
//   //   });

//   //   this.stateControl.valueChanges.subscribe(value => {
//   //     this.validateState(value);
//   //   });
//   // }

//     ngOnInit() {
//     // Set up city autocomplete
//     this.filteredCities = this.cityControl.valueChanges.pipe(
//       startWith(''),
//       switchMap(value => this.googlePlacesService.getAutocompleteSuggestions(value)),
//       map(predictions => predictions.map(prediction => prediction.description)) // Extract only city names
//     );

//     // Set up state autocomplete
//     this.filteredStates = this.stateControl.valueChanges.pipe(
//       startWith(''),
//       map(value => this._filterStates(value))
//     );

//     // When a city is selected, get the state from Google Places API
//     // this.cityControl.valueChanges.subscribe(city => {
//     //   this.filteredCities.subscribe(cities => {
//     //     const selectedCity = cities.find(c => c === city);
//     //     if (selectedCity) {
//     //       this.onCitySelected(selectedCity); // Handle city selection
//     //     }
//     //   });
//     // });
//     this.cityControl.valueChanges.subscribe(city => {
//       this.filteredCities.subscribe(cities => {
//         const selectedCity = cities.find(c => c === city);
//         if (selectedCity) {
//           // Simulate a MatAutocompleteSelectedEvent with the city as the option value
//           // const event = { option: { value: selectedCity } } as MatAutocompleteSelectedEvent;
//           this.onCitySelected(selectedCity.place_id);
//         }
//       });
//     });
//   }

//   private _filterCities(value: string): Observable<string[]> {
//     // Call the service method and return its observable
//     return from(this.googlePlacesService.getAutocompleteSuggestions(value)).pipe(
//       map(predictions => predictions.map(prediction => prediction.description)) // Adjust if needed
//     );
//   }

//   private _filterStates(value: string): string[] {
//     const filterValue = value.toLowerCase();
//     return this.states.filter(state => state.toLowerCase().includes(filterValue));
//   }

//   // When a city is selected, get its details
//   onCitySelected(place_id : any) {
//   // Get the place ID from the autocomplete selection
//   const placeId = place_id

//   // Get place details from Google Places API
//   this.googlePlacesService.getPlaceDetails(placeId)
//     .then(details => {
//       if (!details || !details.address_components) {
//         throw new Error("Invalid place details received");
//       }

//       // The type for address_components is Array<{ long_name: string, short_name: string, types: string[] }>
//       const addressComponents: Array<{ long_name: string; short_name: string; types: string[] }> = details.address_components;

//       // Find the state in the address components
//       const stateComponent = addressComponents.find(component => 
//         component.types.includes('administrative_area_level_1')
//       );

//       if (stateComponent) {
//         // Set the state form control with the found state
//         this.stateControl.setValue(stateComponent.long_name);
//       } else {
//         console.warn("State component not found in address components.");
//       }
//     })
//     .catch(error => {
//       console.error("Error fetching place details:", error);
//       // Optionally, handle the error to notify the user
//     });
// }

// // Example of how to extract state from the place details
// private extractStateFromDetails(details: any): string | null {
//     const addressComponents = details.address_components;
//     for (const component of addressComponents) {
//         if (component.types.includes('administrative_area_level_1')) {
//             return component.long_name;
//         }
//     }
//     return null;
// }

//   validateStreet() {
//     this.showStreetMessage = this.street.length === 0;
//   }

//   validateCity(value: string = '') {
//     this.showCityMessage = !value || value.length === 0;
//   }
  

//   // validateState(value: string = '') {
//   //   this.showStateMessage = value.length === 0;
//   // }
//   validateState(value: string = '') {
//   this.showStateMessage = !value || value.length === 0;
// }
//   clearStreetMessage() {
//     if (this.street.length > 0) {
//       this.showStreetMessage = false;
//     }
//   }

//   clearCityMessage() {
//     if (this.cityControl.value && this.cityControl.value.length > 0) {
//       this.showCityMessage = false;
//     }
//   }

//   clearStateMessage() {
//     if (this.stateControl.value && this.stateControl.value.length > 0) {
//       this.showStateMessage = false;
//     }
//   }

//   @HostListener('document:click', ['$event'])
//   onClickOutside(event: Event) {
//     const targetElement = event.target as HTMLElement;
//     const cityInputElement = document.getElementById('city');
//     const stateInputElement = document.getElementById('state');
//     const cityDropdownElement = document.querySelector('.city-autocomplete-panel'); 
//     const stateDropdownElement = document.querySelector('.state-autocomplete-panel'); 

//     if (cityInputElement && !cityInputElement.contains(targetElement) &&
//         cityDropdownElement && !cityDropdownElement.contains(targetElement)) {
//       this.filteredCities = of([]);
//     }

//     if (stateInputElement && !stateInputElement.contains(targetElement) &&
//         stateDropdownElement && !stateDropdownElement.contains(targetElement)) {
//       this.filteredStates = of([]);
//     }
//   }
// }

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

  constructor(private googlePlacesService: GooglePlacesService) {}

  ngOnInit() {
    // Set up city autocomplete
    this.filteredCities = this.cityControl.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.googlePlacesService.getAutocompleteSuggestions(value)),
      map(predictions => predictions.map(prediction => ({
        name: prediction.terms.length>2 ? prediction.terms[prediction.terms.length - 3].value : '',
        statename : prediction.terms.length>2 ? prediction.terms[prediction.terms.length - 2].value : '',
        place_id: prediction.place_id // Ensure this contains place_id
      } as City))) // Cast to City type here
    );

    // Set up state autocomplete
    this.filteredStates = this.stateControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStates(value))
    );

    // Subscribe to cityControl value changes to handle selection
    this.cityControl.valueChanges.subscribe(value => {
      this.filteredCities.subscribe(cities => {
        const selectedCity = cities.find(c => c.name === value);
        if (selectedCity) {
          this.onCitySelected(selectedCity.statename); // Send place_id to the selection method
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
  onCitySelected(statename: string) {
    // Assuming `statename` is the short form (e.g., 'CA')
    const longStateName = this.stateMapping[statename]; // Get long form from mapping
    if (longStateName) {
      this.stateControl.setValue(longStateName);
      this.clearStateMessage();
       // Set long state name in stateControl
    } else {
      console.warn(`No mapping found for state: ${statename}`);
    }
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
}