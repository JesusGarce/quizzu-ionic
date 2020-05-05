import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PractisePage } from './practise.page';

const routes: Routes = [
  {
    path: '',
    component: PractisePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PractisePageRoutingModule {}
