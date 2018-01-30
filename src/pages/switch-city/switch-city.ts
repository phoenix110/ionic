import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {Store} from "@ngrx/store";
import {Region} from "../../stateStore/log.store";
import {REGION_CODE, REGION_SWITCH} from "../../stateStore/action";

/**
 * Generated class for the SwitchCityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-switch-city',
  templateUrl: 'switch-city.html',
})
export class SwitchCityPage {
  options = [
    {'value': '济南市','code':'370000'},
    {'value': '青岛市','code':'370200'},
    {'value': '淄博市','code':'370300'},
    {'value': '烟台市','code':'370600'}
  ];
  gpsCity:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private store: Store<Region>
    ) {
  }

  ionViewDidLoad() {
    this.gpsCity = localStorage.getItem('gps');
  }
  back() {
    this.navCtrl.pop();
  }
  sendCity(v) {
    this.store.dispatch({type: REGION_SWITCH, payload: v.value});
    this.store.dispatch({type: REGION_CODE, payload: v.code});
    this.navCtrl.pop();
  }
}
