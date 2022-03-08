import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordieService {

  constructor(private http: HttpClient) { }

  private getTodaysWordUrl = 'https://us-central1-wordie-e7fe2.cloudfunctions.net/getTodaysWord'
  private verifyWordUrl = 'https://us-central1-wordie-e7fe2.cloudfunctions.net/verifyWord?word='

  getTodaysWord(): Observable<any> {
      return this.http.get(this.getTodaysWordUrl)
  }

  verifyWord(word: string): Observable<any> {
    return this.http.get(this.verifyWordUrl + word)
  }
}
