import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SwitchCityPage} from "./switch-city";

@NgModule({
  declarations: [
    SwitchCityPage,
  ],
  imports: [
    IonicPageModule.forChild(SwitchCityPage),
  ],
})
export class SwitchCityPageModule {}
