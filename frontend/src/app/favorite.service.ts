import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = 'http://localhost:3000/api/favorite';
  constructor() { }
  saveFavorite(city: string, state: string): Promise<any> {
    return fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city, state }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save favorite');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error saving favorite:', error);
      throw error;
    });
  }
}
