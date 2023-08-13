import { FormControl } from '@angular/forms';

export interface IConvertCurrencyForm {
  amount: FormControl<number | null>;
  fromCurr: FormControl<string | null>;
  toCurr: FormControl<string | null>;
}
export interface IConvertCurrencyObj {
  amount: number | null;
  fromCurr: string | null;
  toCurr: string | null;
}
