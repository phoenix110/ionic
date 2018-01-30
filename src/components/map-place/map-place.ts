import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PlaceDelPage} from "../../pages/place-del/place-del";
import {NavController} from "ionic-angular";

/**
 * Generated class for the MapPlaceComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'map-place',
  templateUrl: 'map-place.html'
})
export class MapPlaceComponent {

@Input()  item:any=null;
@Input() isGps = false;
@Output() onGps = new EventEmitter<any>();

  constructor(public navCtrl: NavController) {}
  // 导航
  toNav(item) {
    this.onGps.emit(item);
  }
  // 跳转详情
  toDetail(id) {
    this.navCtrl.push(PlaceDelPage,{stationID: id});
  }
}
