import { Component } from '@angular/core';
import { IConvertCurrencyObj } from 'src/app/models/IConvertCurrencyForm';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor() {}
  amount!: number;
  fromCurr!: string;
  toCurr!: string;
  rate!: number;

  formValues: IConvertCurrencyObj = {
    amount: 1,
    fromCurr: 'EUR',
    toCurr: 'USD',
  };
  rates: { currencyCode: string; exchangeRate: number }[] = [];

  calculateAgainestPairs(val: string) {
    this.formValues = JSON.parse(val);
  }

  setRatesValues(ratesObj: any) {
    this.rates = JSON.parse(ratesObj);
    this.rates = this.rates.slice(0, 9);
  }
}
