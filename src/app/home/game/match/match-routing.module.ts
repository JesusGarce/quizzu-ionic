import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchPage } from './match.page';

const routes: Routes = [
  {
    path: '',
    component: MatchPage
  },
  {
    path: 'countdown-start',
    loadChildren: () => import('./countdown-start/countdown-start.module').then( m => m.CountdownStartPageModule)
  },  {
    path: 'search-opponent',
    loadChildren: () => import('./search-opponent/search-opponent.module').then( m => m.SearchOpponentPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchPageRoutingModule {}
