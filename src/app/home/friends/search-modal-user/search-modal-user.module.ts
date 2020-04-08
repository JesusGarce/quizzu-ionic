import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchModalUserPageRoutingModule } from './search-modal-user-routing.module';

import { SearchModalUserPage } from './search-modal-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchModalUserPageRoutingModule
  ],
  declarations: [SearchModalUserPage]
})
export class SearchModalUserPageModule {}
