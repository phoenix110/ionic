import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {MapPage} from "../map/map";
import {Store} from '@ngrx/store';
import { Region} from "../../stateStore/log.store";
import {REGION_CODE, REGION_SWITCH} from "../../stateStore/action";
import {Subscription} from "rxjs/Subscription";
import {SwitchCityPage} from "../switch-city/switch-city";
import {LoginPage} from "../login/login";

import {Geolocation} from "@ionic-native/geolocation";
import { SearchPage } from '../search/search';
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {appApis} from "../../providers/apis";
import { MsgCenterPage } from '../msg-center/msg-center';
declare let BMap:any;
/**
 * Generated class for the NavPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-nav',
  templateUrl: 'nav.html',
})
export class NavPage{
s1 = true; // 控制文化页面显示/隐藏
s2 = false; // 控制地图页面显示/隐藏
s3 = false; // 控制活动页面显示/隐藏
s4 = false; // 控制品味页面显示/隐藏
s5 = false; // 控制我页面显示/隐藏
url: any;
// 地区选择
options = [
  {'value': '济南市','code':'370000'},
  {'value': '青岛市','code':'370200'},
  {'value': '淄博市','code':'370300'}
];
selOpt:any = '济南市';
regionArr:any[];
timer:any;
s:Subscription;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private store:Store<Region>,
    private geolocation:Geolocation,
    private httpService: HttpServiceProvider,
  ) {
    this.s = this.store.select(('region' as any)).subscribe((log)=>{
      if (log.city) {
        this.selOpt = log.city;
      }
    });
  }
  ionViewDidLoad() {
    this.getRegionCode();
    this.getPos();
  }
  ionViewDidEnter() {
    //根据设备尺寸固定内容高度
    const div = document.getElementById('cont');
    const totalHeight = document.body.clientHeight - 103;
    div.setAttribute('style',`height:${totalHeight}px`);
  }
  ionViewDidLeave() {
  }
  // 获取行政区划代码
  getRegionCode() {
    const str = {
      "type": "6003",
      "filters": {
        "regional_code": "370000", // 山东省
        "regional_level": 1
      }
    };
    this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(str),
      data => {
        if(data.code === 1){
          this.regionArr = data.data;
        }
      },
      error=> {
        console.log(JSON.stringify(error));
      })
  }
  // 定位
  getPos() {
    const that = this;
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log('ff',resp);
      // resp.coords.latitude
      // resp.coords.longitude
      let geoc = new BMap.Geocoder();
      // const pt ={"lng":resp.coords.longitude,"lat":resp.coords.latitude}
      localStorage.setItem('lon',resp.coords.longitude.toString());
      localStorage.setItem('lat',resp.coords.latitude.toString());
      let pt = new BMap.Point(resp.coords.longitude,resp.coords.latitude);
      geoc.getLocation(pt, function(rs){
        let addComp = rs.addressComponents;
        // alert(addComp.city );
        localStorage.setItem('gps',addComp.city);
        that.selOpt = addComp.city;
        that.store.dispatch({type: REGION_SWITCH, payload: that.selOpt});
        for(let i in that.regionArr) {
          if( that.regionArr[i].regional_name ==  addComp.city ) {
            that.store.dispatch({type: REGION_CODE, payload:that.regionArr[i].regional_code});
          }
        }
      });
    }).catch((error) => {
      // console.log('Error getting location', error);
      that.selOpt = '济南市';
      // that.store.dispatch({type: REGION_SWITCH, payload: that.selOpt});
    });
  }
  showHide() {
    this.navCtrl.push(SwitchCityPage)
  }
  //tab切换
  culShow() {
  this.s1 = true;
  this.s2 = false;
  this.s3 = false;
  this.s4 = false;
  this.s5 = false;
}
mapShow() {
  this.navCtrl.push(MapPage);
}
activeShow() {
  this.s1 = false;
  this.s2 = false;
  this.s3 = true;
  this.s4 = false;
  this.s5 = false;
}
tasteShow() {
  this.s1 = false;
  this.s2 = false;
  this.s3 = false;
  this.s4 = true;
  this.s5 = false;
}
meShow() {
  // this.s1 = false;
  // this.s2 = false;
  // this.s3 = false;
  // this.s4 = false;
  // this.s5 = true;
    // 登录注册判断
  if(!localStorage.getItem('usid')){
    this.navCtrl.push(LoginPage);
  }else{
    this.s1 = false;
    this.s2 = false;
    this.s3 = false;
    this.s4 = false;
    this.s5 = true;
  }
}
search(){
  this.navCtrl.push(SearchPage);
}
open_msgbox(){
  this.navCtrl.push(MsgCenterPage);
}
}
