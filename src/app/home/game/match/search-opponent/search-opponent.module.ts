import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchOpponentPageRoutingModule } from './search-opponent-routing.module';

import { SearchOpponentPage } from './search-opponent.page';
import {LottieAnimationViewModule} from 'ng-lottie';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchOpponentPageRoutingModule,
    LottieAnimationViewModule.forRoot()
  ],
  declarations: [SearchOpponentPage]
})
export class SearchOpponentPageModule {}
