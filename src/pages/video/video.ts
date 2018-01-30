import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";

@Component({
  selector: 'page-video',
  templateUrl: 'video.html',
})
export class VideoPage {
  videoId;
  videoDel: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServiceProvider) {
    this.videoId = navParams.data.videoId;
  }

  ionViewDidLoad() {
    this.getActList();
    console.log('ionViewDidLoad VideoPage');
  }
  getActList(){
    this.videoDel = {};
    let getPageStr = {
      'type':'4001',
      'filters':{
        'id':this.videoId,
        'accid':localStorage.getItem('usid')
      }
    };
    this.httpService.get(appApis.get_app_data + '?getStr='+ JSON.stringify(getPageStr),
      data => {
        if (data && data.data) {
          console.log('活动详情',data.data);
          this.videoDel = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  toBack() {
    this.navCtrl.pop();
  }
}
