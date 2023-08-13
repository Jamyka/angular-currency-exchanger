import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IConvertCurrencyForm } from 'src/app/models/IConvertCurrencyForm';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HomeRoutingModule } from 'src/app/pages/home/home-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { Output, EventEmitter } from '@angular/core';
import { FixerService } from 'src/app/services/fixer.service';
import { Router } from '@angular/router';
import { EventsService } from 'src/app/services/events.service';
import { reserved } from 'src/app/models/reservedWord';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-conversion-form',
  standalone: true,
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  templateUrl: './conversion-form.component.html',
  styleUrls: ['./conversion-form.component.scss'],
})
export class ConversionFormComponent implements OnInit, OnDestroy {
  constructor(
    private api: FixerService,
    private router: Router,
    private eventService: EventsService
  ) {}
  @Input() pageType: 'home' | 'detalis' = 'home';
  @Input() title!: string;
  @Output() valuesChangeEvent = new EventEmitter<string>();
  @Output() ratesChangeEvent = new EventEmitter<string>();
  subscribes: Subscription[] = [];

  convertToRate!: number;
  conversionResult!: number;

  ConvertCurrencyFG: FormGroup<IConvertCurrencyForm> =
    new FormGroup<IConvertCurrencyForm>({
      amount: new FormControl(1, Validators.required),
      fromCurr: new FormControl('EUR', Validators.required),
      toCurr: new FormControl('USD', Validators.required),
    });

  rates: { currencyCode: string; exchangeRate: number }[] = [];

  ngOnInit(): void {
    this.getExchangeRates();
  }

  get fgControls() {
    return this.ConvertCurrencyFG.controls;
  }

  getExchangeRates() {
    this.eventService.broadcast(reserved.isLoading, true);
    const sub = this.api.getRates().subscribe({
      next: (res) => {
        for (const currencyCode in res.rates) {
          this.rates.push({
            currencyCode: currencyCode,
            exchangeRate: res.rates[currencyCode],
          });
        }
        this.ratesChangeEvent.emit(JSON.stringify(this.rates));

        this.findToExchangeRate();
        this.eventService.broadcast(reserved.isLoading, false);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.subscribes.push(sub);
  }

  onValuesChange() {
    this.rates.find(
      (val) => val.currencyCode == this.fgControls.toCurr.getRawValue()
    );
    this.emitAmountValue();
  }

  swapValues() {
    const fromValue = this.fgControls.fromCurr.getRawValue();
    const toValue = this.fgControls.toCurr.getRawValue();
    this.fgControls.fromCurr.patchValue(toValue);
    this.fgControls.toCurr.patchValue(fromValue);
    this.findToExchangeRate();
    this.emitAmountValue();
    this.conversionResult = 0;
  }

  findToExchangeRate() {
    if (this.fgControls.toCurr.getRawValue() === 'EUR') {
      this.convertToRate = 1 / this.convertToRate;
    } else {
      this.convertToRate = this.rates.filter(
        (val) => val.currencyCode == this.fgControls.toCurr.getRawValue()
      )[0].exchangeRate!;
    }
  }

  emitAmountValue() {
    this.valuesChangeEvent.emit(
      JSON.stringify(this.ConvertCurrencyFG.getRawValue())
    );
  }

  goToDetails() {
    this.router.navigate(['/details'], {
      queryParams: {
        fromCurr: this.ConvertCurrencyFG.getRawValue().fromCurr,
        toCurr: this.ConvertCurrencyFG.getRawValue().toCurr,
      },
    });
  }

  onSubmit() {
    this.conversionResult =
      +this.ConvertCurrencyFG.getRawValue().amount! * this.convertToRate;
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
