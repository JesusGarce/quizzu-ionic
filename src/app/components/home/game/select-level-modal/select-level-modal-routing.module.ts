import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectLevelModalPage } from './select-level-modal.page';

const routes: Routes = [
  {
    path: '',
    component: SelectLevelModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectLevelModalPageRoutingModule {}
