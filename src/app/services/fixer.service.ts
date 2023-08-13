import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDefaultValues } from '../config/IDefaultValues';

@Injectable({
  providedIn: 'root',
})
export class FixerService {
  constructor(private http: HttpClient) {}

  // http://data.fixer.io/api/latest?access_key=95b15c6a0146fb5a473514596119626a
  getRates() {
    return this.http.get<any>(
      `${IDefaultValues.apiURL}/latest?access_key=${IDefaultValues.apiKey}`
    );
  }

  // https://data.fixer.io/api/symbols
  getCurrFullName() {
    return this.http.get<any>(
      `${IDefaultValues.apiURL}/symbols?access_key=${IDefaultValues.apiKey}`
    );
  }
  // http://data.fixer.io/api/2013-12-24? access_key = 95b15c6a0146fb5a473514596119626a& base=EUR&symbols=USD,CAD,GBP
  //  `${IDefaultValues.apiURL}/${date}?access_key=${IDefaultValues.apiKey}&base=EUR&symbols=USD,CAD,GBP`

  getCurrHistory(date: Date, fromCurr: string, toCurr: string) {
    console.log(fromCurr + '+' + toCurr);
    return this.http.get<any>(
      `${IDefaultValues.apiURL}/${date}?access_key=${IDefaultValues.apiKey}&base=${fromCurr}&symbols=${toCurr}`
    );
  }
}
