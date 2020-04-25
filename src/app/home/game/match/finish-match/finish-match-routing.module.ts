import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinishMatchPage } from './finish-match.page';

const routes: Routes = [
  {
    path: '',
    component: FinishMatchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinishMatchPageRoutingModule {}
