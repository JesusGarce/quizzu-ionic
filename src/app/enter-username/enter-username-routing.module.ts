import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnterUsernamePage } from './enter-username.page';

const routes: Routes = [
  {
    path: '',
    component: EnterUsernamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnterUsernamePageRoutingModule {}
