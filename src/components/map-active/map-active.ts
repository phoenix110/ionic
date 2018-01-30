import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ActDetailPage} from "../../pages/act-detail/act-detail";
import {NavController} from "ionic-angular";

/**
 * Generated class for the MapActiveComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'map-active',
  templateUrl: 'map-active.html'
})
export class MapActiveComponent implements OnChanges{
@Input() item:any;
@Input() isGps:any = false;
@Output() onGps1 = new EventEmitter<any>();

data:any;
time:any;

  constructor(public navCtrl: NavController) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    const arr = this.item.starttime.split(' ');
    this.data = arr[0].split('-').slice(1).join('.');
    this.time = arr[1].split(':').slice(0,2).join(':')
  }
  toActDel(id) {
    // this.navCtrl.pop();
    this.navCtrl.push(ActDetailPage,{actid:id});
  }
  toNav2(item) {
    this.onGps1.emit(item);
  }
}
