import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectLevelModalPageRoutingModule } from './select-level-modal-routing.module';

import { SelectLevelModalPage } from './select-level-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectLevelModalPageRoutingModule
  ],
  declarations: [SelectLevelModalPage]
})
export class SelectLevelModalPageModule {}
