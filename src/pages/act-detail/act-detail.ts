import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import {PlaceDelPage} from "../place-del/place-del";
import {ReversePage} from "../reverse/reverse";
import {AppraisePage} from "../appraise/appraise";
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {VideoPage} from "../video/video";
import {LoginPage} from "../login/login";
import {MapPage} from "../map/map";
import {Coordination} from "../../stateStore/log.store";
import {Store} from "@ngrx/store";
import {COORD} from "../../stateStore/action";

/**
 * Generated class for the ActDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-act-detail',
  templateUrl: 'act-detail.html',
})
export class ActDetailPage {
  actId;
  actDel: any = {};
  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    public navParams: NavParams,
    private httpService: HttpServiceProvider,
    private store:Store<Coordination>
    ) {
    this.actId = navParams.data.actid;
  }
  ionViewDidLoad() {
    //根据设备尺寸固定内容高度
    const div = document.getElementById('actdelBody');
    const tit = document.getElementsByClassName('adelTit')[0];
    div.style.height = document.documentElement.clientHeight - tit.clientHeight + 'px';
    /*====*/
    this.getActDetail();
  }

  // 获得对应的活动详情
  getActDetail() {
    const getStr = {
      'type': '4001',
      'filters': {
        'accid': localStorage.getItem('usid'),
        'id': this.actId
      }
    };
    this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(getStr),
      data => {
      console.log(data.data);
        if (data && data.data) {
          this.actDel = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  /*场馆主页*/
  toplaceDel(stationID, stationType){
    this.navCtrl.push(PlaceDelPage, {stationID: stationID, stationType:stationType});
  }
  /*活动直播*/
  tovideo(videoId){
    this.navCtrl.push(VideoPage,{videoId: videoId});
  }
  /*活动预定*/
  toReserve(actdel){
    if(localStorage.getItem('usid')){
      this.navCtrl.push(ReversePage,{actdel: actdel});
    }else{
      alert('您还未登录');
      // this.navCtrl.push(LoginPage);
    }
  }
  reCollect($event){
    this.getActDetail();
  }
  /*精彩点评*/
  toAppraise(){
    this.navCtrl.push(AppraisePage);
  }
  toBack() {
    this.navCtrl.pop();
    // this.navCtrl.push(MapPage);
  }
  // 地图导航
  actToMap() {
    this.store.dispatch({type:COORD,payload:this.actDel.coordinates});
    this.navCtrl.pop();
    // this.navCtrl.push(MapPage, {
    //   coord:  this.actDel.coordinates,
    //   id:0
    // })
  }
}
