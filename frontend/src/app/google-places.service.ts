import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
interface Prediction {
    terms: { value: string }[]; 
    place_id: string; 

}

@Injectable({
  providedIn: 'root'
})



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
            //return (data.predictions || []).filter((prediction: Prediction) => prediction.terms.length === 3);
            return data.predictions;
        } catch (error) {
            console.error("Error fetching autocomplete suggestions:", error);
            throw error; // Rethrow or handle the error
        }
    }
}
