import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinishPractisePage } from './finish-practise.page';

const routes: Routes = [
  {
    path: '',
    component: FinishPractisePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinishPractisePageRoutingModule {}
