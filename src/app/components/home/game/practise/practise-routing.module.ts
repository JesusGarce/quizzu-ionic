import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PractisePage } from './practise.page';

const routes: Routes = [
  {
    path: '',
    component: PractisePage
  },
  {
    path: 'finish-practise',
    loadChildren: () => import('./finish-practise/finish-practise.module').then(m => m.FinishPractisePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PractisePageRoutingModule {}
