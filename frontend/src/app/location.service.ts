import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private citySubject = new BehaviorSubject<string>('');
  private stateSubject = new BehaviorSubject<string>('');

  city$ = this.citySubject.asObservable();
  state$ = this.stateSubject.asObservable();

  setCity(city: string) {
    this.citySubject.next(city);
  }

  setState(state: string) {
    this.stateSubject.next(state);
  }
}