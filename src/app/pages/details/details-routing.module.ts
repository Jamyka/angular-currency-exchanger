import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EurUsdComponent } from './eur-usd/eur-usd.component';
import { EurGbpComponent } from './eur-gbp/eur-gbp.component';

const routes: Routes = [
  { path: 'eur-usd', component: EurUsdComponent },
  { path: 'eur-gbp', component: EurGbpComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsRoutingModule {}
