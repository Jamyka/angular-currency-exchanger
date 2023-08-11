import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsRoutingModule } from './details-routing.module';
import { EurUsdComponent } from './eur-usd/eur-usd.component';
import { EurGbpComponent } from './eur-gbp/eur-gbp.component';

@NgModule({
  declarations: [EurUsdComponent, EurGbpComponent],
  imports: [CommonModule, DetailsRoutingModule],
})
export class DetailsModule {}
