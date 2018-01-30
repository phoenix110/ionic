import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  plaIndex = 0;
  placeNav = [
    { id: 0, tit: '活动'},
    { id: 1, tit: '品味'},
    { id: 2, tit: '景点'},
    { id: 3, tit: '场馆'}
  ]
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }
  changeNav(index) {
    this.plaIndex = index;
  }
  toBack() {
    this.navCtrl.pop();
  }
}
