import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountdownStartPageRoutingModule } from './countdown-start-routing.module';

import { CountdownStartPage } from './countdown-start.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountdownStartPageRoutingModule
  ],
  declarations: [CountdownStartPage]
})
export class CountdownStartPageModule {}
