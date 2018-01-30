import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {TasteAppsubPage} from "../taste-appsub/taste-appsub";
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";

/**
 * Generated class for the TasteDelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-taste-del',
  templateUrl: 'taste-del.html',
})
export class TasteDelPage {
  tastId;
  appraiseNum;
  testDel: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServiceProvider) {
    this.tastId = navParams.data.tastId;
  }

  ionViewDidLoad() {
    this.getTastDel();
    this.getValueList();
    //根据设备尺寸固定内容高度
    const div = document.getElementById('tasDelBody');
    const tit = document.getElementsByClassName('tdelTit')[0];
    div.style.height = document.documentElement.clientHeight - tit.clientHeight + 'px';
  }
  /*见闻详情*/
  getTastDel(){
    const getStr = {
      'type': '11001',
      'filters':{
        'id': this.tastId,
        'accid': localStorage.getItem('usid')
      }
    };
    this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(getStr),
      data => {
        console.log(data);
        if (data && data.data){
          this.testDel = data.data;
          console.log(this.testDel.id);
        }
      },
      error => {
        console.error(error);
      });
  }
  // 获得见闻评论列表
  getValueList() {
    const getPageStr = {
      'type': '0016',
      'filters': {
        'type': '10',
        'bizid': this.tastId,
      },
    };
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getPageStr),
      data => {
        if (data ) {
          this.appraiseNum = data.rows;
        }},
      error => {
        console.error(error);
      });
  }
  /*收藏*/
  reCollect($event){
    console.log($event);
    this.getTastDel();
  }
  toTastAppSub(tasteID,title){
    this.navCtrl.push(TasteAppsubPage,{tasteID:tasteID, tasteTit:title});
  }
  toBack() {
    this.navCtrl.pop();
  }
}
