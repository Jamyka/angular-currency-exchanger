import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'src/app/services/events.service';
import { reserved } from 'src/app/models/reservedWord';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-conversion-form',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
  ],
  templateUrl: './conversion-form.component.html',
  styleUrls: ['./conversion-form.component.scss'],
})
export class ConversionFormComponent implements OnInit, OnDestroy {
  constructor(
    private api: FixerService,
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventsService,
    private modalService: NgbModal
  ) {}
  @Input() pageType: 'home' | 'detalis' = 'home';
  @Input() title!: string;
  @Output() valuesChangeEvent = new EventEmitter<string>();
  @Output() ratesChangeEvent = new EventEmitter<string>();
  @ViewChild('content') errModal!: NgbModalRef;
  subscribes: Subscription[] = [];

  convertToRate!: number;
  conversionResult!: number;
  errorMsg!: string;

  ConvertCurrencyFG: FormGroup<IConvertCurrencyForm> =
    new FormGroup<IConvertCurrencyForm>({
      amount: new FormControl(1, Validators.required),
      fromCurr: new FormControl('EUR', Validators.required),
      toCurr: new FormControl('USD', Validators.required),
    });

  rates: { currencyCode: string; exchangeRate: number }[] = [];

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (this.pageType === 'detalis') {
        this.fgControls.fromCurr.patchValue(params['fromCurr']);
        this.fgControls.toCurr.patchValue(params['toCurr']);
      }
    });
    this.getExchangeRates();

    this.fgControls.amount.valueChanges.subscribe((res) => {
      if (res == null || res <= 0) {
        this.fgControls.fromCurr.disable();
        this.fgControls.toCurr.disable();
      } else {
        this.fgControls.fromCurr.enable();
        this.fgControls.toCurr.enable();
      }
    });
  }

  get fgControls() {
    return this.ConvertCurrencyFG.controls;
  }

  getExchangeRates() {
    this.eventService.broadcast(reserved.isLoading, true);
    const sub = this.api.getRates().subscribe({
      next: (res) => {
        if (res.success) {
          for (const currencyCode in res.rates) {
            this.rates.push({
              currencyCode: currencyCode,
              exchangeRate: res.rates[currencyCode],
            });
          }
          this.ratesChangeEvent.emit(JSON.stringify(this.rates));
          this.findToExchangeRate();
        } else {
          this.errorMsg = res.error.info;
          this.openErrorModal(this.errModal);
        }
        this.eventService.broadcast(reserved.isLoading, false);
      },
      error: (err) => {
        this.errorMsg = err.message;
        this.openErrorModal(this.errModal);
        this.eventService.broadcast(reserved.isLoading, false);
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
    if (
      this.fgControls.amount.value == null ||
      this.fgControls.amount.value <= 0
    ) {
      return;
    } else {
      const fromValue = this.fgControls.fromCurr.getRawValue();
      const toValue = this.fgControls.toCurr.getRawValue();
      this.fgControls.fromCurr.patchValue(toValue);
      this.fgControls.toCurr.patchValue(fromValue);
      this.findToExchangeRate();
      this.emitAmountValue();
      this.conversionResult = 0;
    }
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

  openErrorModal(content: any) {
    this.modalService.open(content, { centered: true });
  }
  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
