import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PractisePageRoutingModule } from './practise-routing.module';

import { PractisePage } from './practise.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PractisePageRoutingModule
  ],
  declarations: [PractisePage]
})
export class PractisePageModule {}
