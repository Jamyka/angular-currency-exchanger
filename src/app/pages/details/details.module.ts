import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from './details/details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConversionFormComponent } from 'src/app/components/conversion-form/conversion-form.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [DetailsComponent],
  imports: [
    CommonModule,
    DetailsRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    ConversionFormComponent,
    NgApexchartsModule,
    NgbModule,
  ],
})
export class DetailsModule {}
