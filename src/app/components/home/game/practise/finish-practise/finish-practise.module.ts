import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinishPractisePageRoutingModule } from './finish-practise-routing.module';

import { FinishPractisePage } from './finish-practise.page';
import {LottieAnimationViewModule} from 'ng-lottie';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FinishPractisePageRoutingModule,
        LottieAnimationViewModule
    ],
  declarations: [FinishPractisePage]
})
export class FinishPractisePageModule {}
