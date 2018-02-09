import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import $ from 'jquery';
import {AlertController} from 'ionic-angular';
import {QQSDK, QQShareOptions} from "@ionic-native/qqsdk";

declare let WeiboSDK:any;
declare let Wechat;
@Component({
  selector: 'collect-transpond',
  templateUrl: 'collect-transpond.html'
})
export class CollectTranspondComponent implements OnInit{
  @Input() colDel = null;
  @Input() type;
  @Output() reCollect= new EventEmitter();
  aH:any;
  cH:any;
  ss = false;

  constructor( private httpService: HttpServiceProvider, private alertCtrl: AlertController,private qq:QQSDK) {

  }
  ngOnInit(): void {
  this.cH = document.body.clientHeight;// 设备高度
  }
  // 收藏
  isCollect(id,type) {
    console.log(id);
    if (localStorage.getItem('usid')) {
      const postStr = {
        'type': '0009',
        'data': {
          'accid': localStorage.getItem('usid'),
          'bizid': id,
          'type': this.type,
        },
        'operate': 'A'
      };
      this.httpService.post(appApis.get_app_data + '?postStr=' + JSON.stringify(postStr),
        data => {
          if (data) { }},
        error => {
          if (error) {
            console.log('error');
            if (error.code === 1) {
              this.reCollect.emit(error.msg);
              let alert = this.alertCtrl.create({
                title: '提示信息',
                subTitle: '收藏成功',
                buttons: ['确定']
              });
              alert.present();
            }else {
              let alert = this.alertCtrl.create({
                title: '提示信息',
                subTitle: '收藏失败',
                buttons: ['确定']
              });
              alert.present();
            }
          }
        });
    }else {
      let alert = this.alertCtrl.create({
        title: '提示信息',
        subTitle: '请先登录',
        buttons: ['确定']
      });
      alert.present();
    }
  }
  // 取消收藏
  noCollect(collection_id) {
    console.log(collection_id);
    const postStr = {
      'type': '0009',
      'key': collection_id,
      'operate': 'R'
    };
    this.httpService.post(appApis.get_app_data + '?postStr=' + JSON.stringify(postStr),
      data => {
        if (data) {
        }
      },
      error => {
        console.log(error);
        if (error) {
          if (error.code === 1) {
            let alert = this.alertCtrl.create({
              title: '提示信息',
              subTitle: '取消收藏',
              buttons: ['确定']
            });
            alert.present();
            this.reCollect.emit(error.msg) ;
          }else {
            let alert = this.alertCtrl.create({
              title: '提示信息',
              subTitle: '取消收藏失败',
              buttons: ['确定']
            });
            alert.present();

          }
        }
      });
  }
  // 转发
  share() {
    this.ss = true;
    setTimeout(()=>{
      this.aH = Number.parseInt($('#share-content').css('height'));
      $('#share-content').animate({'top':`${this.cH - this.aH}px`},500);
    });
  }
  /**
   * 微信分享
   *
   * @param scene 0：朋友; 1:朋友圈; 2: 收藏夹;
   */
  weChatShare(scene){
    Wechat.share({
      message: {
        title: "哇塞",
        description: "你真帅！",// 分享给好友会显示描述
        media: {
          type: Wechat.Type.WEBPAGE,
          webpageUrl: "http://www.wenmind.com/"
        }
      },
      scene: scene
    }, function () {
      alert("分享成功");
    }, function (reason) {
      alert('分享失败');
    });
  }
  // qq分享
  qqShare() {
    const options: QQShareOptions = {
      client: this.qq.ClientType.QQ,
      scene: this.qq.Scene.QQ,
      title: 'qq分享测试',
      url: 'http://www.wenmind.com/',
      image: 'https://cordova.apache.org/static/img/cordova_bot.png',
      description: 'qq分享测试',
      flashUrl:  'http://stream20.qqmusic.qq.com/30577158.mp3',
    };
    this.qq.shareNews(options)
      .then(() => {
        console.log('shareImage success');
      })
      .catch(error => {
        console.log(error);
      });
  }
  // 微博分享
  weiboShare() {
    let args = {
      url: 'https://cordova.apache.org/',
      title:'Apache Cordova',
      description: 'This is a Cordova Plugin',
      image:'https://cordova.apache.org/static/img/pluggy.png'
    };
    WeiboSDK.shareToWeibo(function () {
      let alert = this.alertCtrl.create({
        title: '提示信息',
        subTitle: '分享成功',
        buttons: ['确定']
      });
      alert.present();
    }, function (failReason) {
      let alert = this.alertCtrl.create({
        title: '提示信息',
        subTitle: '分享失败',
        buttons: ['确定']
      });
      alert.present();
    }, args);
  }
  // 取消分享
  cancelShare() {
    $('#share-content').animate({'top':`100%`},500);
    setTimeout(()=>{
      this.ss = false;
    },500);
  }
}
