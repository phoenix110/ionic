import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import {ActDetailPage} from "../act-detail/act-detail";
import {VideoPage} from "../video/video";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {appApis} from "../../providers/apis";

@Component({
  selector: 'page-act-online',
  templateUrl: 'act-online.html',
})
export class ActOnlinePage {
  title ;
  activList: any = [];
  /*活动在线*/
  actCIdOn = '';
  page: any = {
    pageIndex: 1,
    pageSeize: 8,
    pageTotal: 0
  };
  /*回顾*/
  actCIdB = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,private httpService: HttpServiceProvider) {
    this.title = navParams.data.title;
    // console.log(this.title);
  }

  ionViewDidLoad() {
    console.log(this.title);
    let div;
    if(this.title == 0){
       div = document.getElementById('onlineBox');
       this.getActOnline();
    }else {
       div = document.getElementById('backBox');
      this.getActList();
    }
    //根据设备尺寸固定内容高度

    const tit = document.getElementsByClassName('onlineTit')[0];
    const nav = document.getElementsByClassName('swiper-container')[0];
    div.style.height = document.documentElement.clientHeight - tit.clientHeight - nav.clientHeight + 'px';
  }

  /*=========活动在线==============*/
  /*子组件传的navID*/
  resActClaOn($event) {
    this.actCIdOn = $event;
    this.getActOnline();
    console.log($event);
  }
  // 获得活动在线列表数据
  getActOnline(){
    this.activList = [];
    let getPageStr = {
      'sorts':{
        'sort':'status',
        'order':'asc'
      },
      'pagesize': this.page.pageSeize ,
      'pagenum': this.page.pageIndex,
      'type':'4000',
      'filters':{
        'classifyid': this.actCIdOn,
        'l_status':1
      }
    };
    this.httpService.get(appApis.get_app_data + '?getPageStr='+ JSON.stringify(getPageStr),
      data => {
        console.log(data);
        if (data && data.data) {
          this.activList = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  /*==========回顾===============*/
  resActClaB($event) {
    this.actCIdB = $event;
    this.getActList();
  }
  // 获得活动列表数据
  getActList(){
    this.activList = [];
    let getPageStr = {
      'sorts':{
        'sort':'status',
        'order':'asc'
      },
      'pagesize': this.page.pageSeize ,
      'pagenum': this.page.pageIndex,
      'type':'4000',
      'filters':{
        'status': 2,
        'classifyid': this.actCIdB,
      }
    };
    this.httpService.get(appApis.get_app_data + '?getPageStr='+ JSON.stringify(getPageStr),
      data => {
        console.log(data.data);
        if (data && data.data) {
          this.activList = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  /*===============*/
  toActDel(id) {
    this.navCtrl.push(ActDetailPage, {actid:id});
  }
  toVideo() {
    this.navCtrl.push(VideoPage);
  }
  toBack() {
    this.navCtrl.pop();
  }
}
