import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnterUsernamePageRoutingModule } from './enter-username-routing.module';

import { EnterUsernamePage } from './enter-username.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnterUsernamePageRoutingModule
  ],
  declarations: [EnterUsernamePage]
})
export class EnterUsernamePageModule {}
