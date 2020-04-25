import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinishMatchPageRoutingModule } from './finish-match-routing.module';

import { FinishMatchPage } from './finish-match.page';
import {LottieAnimationViewModule} from 'ng-lottie';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinishMatchPageRoutingModule,
    LottieAnimationViewModule.forRoot()
  ],
  declarations: [FinishMatchPage]
})
export class FinishMatchPageModule {}
