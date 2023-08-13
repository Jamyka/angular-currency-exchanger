import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import { Subscription, forkJoin } from 'rxjs';
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
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  constructor(private route: ActivatedRoute, private api: FixerService) {}
  currencyName!: string;
  params!: any;
  subscribes: Subscription[] = [];

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.params = params;
    });
    this.getCurrFullName();
    this.getCurrHistory();

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
        this.currencyName = `${this.params.toCurr} - ${
          res.symbols[this.params.toCurr]
        }`;
      },
      error: (err) => {
        console.log(err);
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

  getCurrHistory() {
    const dates = this.getLastDaysOfLastYearMonths();
    const observables = dates.map((date) =>
      this.api.getCurrHistory(date as any, this.params.toCurr)
    );

    const sub = forkJoin(observables).subscribe({
      next: (res) => {
        this.chartOptions.series = [
          {
            data: res.map((item) => {
              return item.rates[this.params.toCurr];
            }),
          },
        ];
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.subscribes.push(sub);
  }
  ngOnDestroy(): void {
    this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
  }
}
