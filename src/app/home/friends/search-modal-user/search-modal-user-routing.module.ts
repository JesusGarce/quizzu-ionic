import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchModalUserPage } from './search-modal-user.page';

const routes: Routes = [
  {
    path: '',
    component: SearchModalUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchModalUserPageRoutingModule {}
