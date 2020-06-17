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
    loadChildren: () => import('./countdown-start/countdown-start.module').then(m => m.CountdownStartPageModule)
  },
  {
    path: 'search-opponent',
    loadChildren: () => import('./search-opponent/search-opponent.module').then(m => m.SearchOpponentPageModule)
  },
  {
    path: 'finish-match',
    loadChildren: () => import('./finish-match/finish-match.module').then(m => m.FinishMatchPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchPageRoutingModule {}
