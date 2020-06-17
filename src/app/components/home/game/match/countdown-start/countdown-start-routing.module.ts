import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountdownStartPage } from './countdown-start.page';

const routes: Routes = [
  {
    path: '',
    component: CountdownStartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountdownStartPageRoutingModule {}
