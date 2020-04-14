import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CovidApiService {

  constructor(private http: HttpClient) { }

  getLatestData() {
    return this.http.get("https://api.rootnet.in/covid19-in/stats/latest");
  }
}
