import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
interface Prediction {
    terms: { value: string }[]; // Adjust this based on the actual structure of terms
    place_id: string; // Assuming place_id is part of the prediction object
    // Add any other fields as needed based on the API response
}

@Injectable({
  providedIn: 'root'
})
// export class GooglePlacesService {
//   private apiKey = 'AIzaSyCiJJRL9f7UyhZaDDc6NNlEfMWf-LU7er0'; // Replace with your Google Places API key
//   // private baseUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

//   constructor() {}

//   getAutocompleteSuggestions(query: string): Observable<any[]> {
//     const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${this.apiKey}`;
    
//     // Use fetch to get the data and convert it to an observable
//     return from(
//       fetch(url)
//         .then(response => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.json();
//         })
//         .then(data => data.predictions) // Assuming your API returns an array of predictions
//     );
//   }
// }

// export class GooglePlacesService {
//   getAutocompleteSuggestions(query: string): Observable<any[]> {
//     // Use fetch to get suggestions from the Google Places API
//     return new Observable(observer => {
//       fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=AIzaSyCiJJRL9f7UyhZaDDc6NNlEfMWf-LU7er0`)
//         .then(response => response.json())
//         .then(data => {
//           observer.next(data.predictions); // Adjust based on the actual response
//           observer.complete();
//         })
//         .catch(error => {
//           observer.error(error);
//         });
//     });
//   }
// }

// export class GooglePlacesService {
//     async getAutocompleteSuggestions(value: string): Promise<any[]> {
//         const response = await fetch(`/api/maps/api/place/autocomplete/json?input=${value}&key=AIzaSyCiJJRL9f7UyhZaDDc6NNlEfMWf-LU7er0`); // Update with actual API endpoint
//         const data = await response.json();
//         return data; // Adjust based on the structure of the response
//     }
// }

// export class GooglePlacesService {
//     async getAutocompleteSuggestions(value: string): Promise<any[]> {
//         const response = await fetch(`/api/place/autocomplete/json?input=${value}&key=AIzaSyCiJJRL9f7UyhZaDDc6NNlEfMWf-LU7er0`);
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         return data; // Adjust based on the structure of the response
//     }
// }

// export class GooglePlacesService {
// async getAutocompleteSuggestions(value: string): Promise<any[]> {
//     if (!value) {
//         //console.error("Input is empty");
//         return []; // Handle the case for empty input
//     }

//     try {
//         const response = await fetch(`/api/place/autocomplete/json?input=${value}&key=AIzaSyCiJJRL9f7UyhZaDDc6NNlEfMWf-LU7er0`);
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         return data.predictions || [];;
//     } catch (error) {
//         console.error("Error fetching autocomplete suggestions:", error);
//         throw error; // Rethrow or handle the error
//     }
// }




//   //  async getPlaceDetails(placeId: string): Promise<any> {
//   //   try {
//   //     const response = await fetch(
//   //       `/api/place/details/json?placeid=${placeId}&key=AIzaSyCiJJRL9f7UyhZaDDc6NNlEfMWf-LU7er0`
//   //     );
//   //     if (!response.ok) {
//   //       throw new Error(`HTTP error! status: ${response.status}`);
//   //     }
//   //     const data = await response.json();
//   //     return data.result;
//   //   } catch (error) {
//   //     console.error("Error fetching place details:", error);
//   //     throw error;
//   //   }
//   // }
// //   async getPlaceDetails(placeId: string): Promise<any> {
// //   try {
// //     // If using a full URL directly to the Google API
// //     const response = await fetch(
// //       `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=YOUR_API_KEY`
// //     );
    
// //     // Check if the response is okay
// //     if (!response.ok) {
// //       throw new Error(`HTTP error! status: ${response.status}`);
// //     }

// //     // Parse the response JSON
// //     const data = await response.json();

// //     // Check if data.result is defined before returning
// //     if (!data.result) {
// //       throw new Error("No result found in the response");
// //     }

// //     return data.result;
// //   } catch (error) {
// //     console.error("Error fetching place details:", error);
// //     throw error; // Rethrow the error to be handled by the calling function
// //   }
// // }

// }



export class GooglePlacesService {
    async getAutocompleteSuggestions(value: string): Promise<Prediction[]> {
        if (!value) {
            // Handle the case for empty input
            return [];
        }

        try {
            const response = await fetch(`/api/place/autocomplete/json?input=${value}&types=(cities)&components=country:us&key=AIzaSyCiJJRL9f7UyhZaDDc6NNlEfMWf-LU7er0`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Filter predictions to return only those with terms.length === 3
            return (data.predictions || []).filter((prediction: Prediction) => prediction.terms.length === 3);

        } catch (error) {
            console.error("Error fetching autocomplete suggestions:", error);
            throw error; // Rethrow or handle the error
        }
    }
}
