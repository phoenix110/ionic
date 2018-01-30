import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AppraisePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-appraise',
  templateUrl: 'appraise.html',
})
export class AppraisePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    //根据设备尺寸固定内容高度
    const div = document.getElementById('appraiseBody');
    const tit = document.getElementsByClassName('appraTit')[0];
    div.style.height = document.documentElement.clientHeight - tit.clientHeight + 'px';
  }
  toBack() {
    this.navCtrl.pop();
  }
}
