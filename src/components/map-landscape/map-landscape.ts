import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NavController} from "ionic-angular";
import {ScenDelPage} from "../../pages/scen-del/scen-del";

/**
 * Generated class for the MapLandscapeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'map-landscape',
  templateUrl: 'map-landscape.html'
})
export class MapLandscapeComponent {
@Input() item:any;
@Input() isGps:any = false;
@Output() onGps2 = new EventEmitter<any>();
  constructor(public navCtrl: NavController) {
  }
  toNav1(item) {
    this.onGps2.emit(item);
  }
  toLandDel(id) {
    this.navCtrl.push(ScenDelPage,{scenicID: id});
  }
}
