import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private showContentSubject = new BehaviorSubject<boolean>(false);
  showContent$ = this.showContentSubject.asObservable();

  // Method to toggle the content visibility
  toggleContentVisibility(show: boolean) {
    this.showContentSubject.next(show);
  }
}
