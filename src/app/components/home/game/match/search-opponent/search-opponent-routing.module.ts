import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchOpponentPage } from './search-opponent.page';

const routes: Routes = [
  {
    path: '',
    component: SearchOpponentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchOpponentPageRoutingModule {}
