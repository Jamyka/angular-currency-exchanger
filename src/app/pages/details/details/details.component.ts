import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import { Subscription, forkJoin } from 'rxjs';
import { reserved } from 'src/app/models/reservedWord';
import { EventsService } from 'src/app/services/events.service';
import { FixerService } from 'src/app/services/fixer.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  @ViewChild('chartObj') chart!: ChartComponent;
  @ViewChild('content') errModal!: NgbModalRef;
  public chartOptions!: Partial<ChartOptions>;
  constructor(
    private route: ActivatedRoute,
    private api: FixerService,
    private eventService: EventsService,
    private modalService: NgbModal
  ) {}
  currencyName!: string;
  errorMsg!: string;
  params!: any;
  changedFromValue!: string;
  changedToValue!: string;
  subscribes: Subscription[] = [];

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.params = params;
    });
    this.getCurrFullName();
    this.getCurrHistory(this.params.fromCurr, this.params.toCurr);

    this.chartOptions = {
      series: [
        {
          name: 'My-series',
          data: [],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        id: 'currChart',
      },
      title: {
        text: `${this.params.fromCurr} against ${this.params.toCurr}`,
        style: {
          fontSize: '18px',
          fontFamily: 'system-ui',
        },
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
    };
  }

  getCurrFullName() {
    const sub = this.api.getCurrFullName().subscribe({
      next: (res) => {
        if (res.success) {
          this.currencyName = `${this.params.toCurr} - ${
            res.symbols[this.params.toCurr]
          }`;
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

  formatAsYYYYMMDD(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getLastDaysOfLastYearMonths() {
    const currentDate = new Date();
    const lastYear = currentDate.getFullYear() - 1;

    const lastDaysOfMonths = [];

    for (let month = 0; month < 12; month++) {
      const lastDayOfMonth = new Date(lastYear, month + 1, 0);
      lastDaysOfMonths.push(this.formatAsYYYYMMDD(lastDayOfMonth));
    }

    return lastDaysOfMonths;
  }

  getCurrHistory(currFrom: string, currTo: string) {
    this.eventService.broadcast(reserved.isLoading, true);
    const dates = this.getLastDaysOfLastYearMonths();

    const observables = dates.map((date) =>
      this.api.getCurrHistory(
        date as any,
        currFrom || this.params.fromCurr,
        currTo
      )
    );
    const sub = forkJoin(observables).subscribe({
      next: (res) => {
        if (res.every((item) => item.success)) {
          const resArr = res.map((item) => {
            return item.rates[currTo];
          });
          this.chartOptions.series = [
            {
              data: resArr,
            },
          ];
        } else {
          this.errorMsg = res.map((item) => item.error.info)[0];
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

  updateChartData(val: string) {
    this.changedFromValue = JSON.parse(val).fromCurr;
    this.changedToValue = JSON.parse(val).toCurr;
    if (this.changedToValue)
      this.getCurrHistory(this.changedFromValue, this.changedToValue);
    else this.getCurrHistory('', this.params.toCurr);
  }

  openErrorModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
