import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {QQSDK, QQShareOptions} from "@ionic-native/qqsdk";
import $ from 'jquery';
declare let WeiboSDK:any;
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

  constructor( private httpService: HttpServiceProvider, private qq:QQSDK) {

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
            if (error.code === 1) {
              this.reCollect.emit(error.msg);
              alert('收藏成功')
            }else {
              alert('收藏失败')
            }
          }
        });
    }else {
      alert('请先登录')
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
            alert('您已取消收藏');
            this.reCollect.emit(error.msg) ;
          }else {
            alert('取消收藏失败');

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
      alert('share success');
    }, function (failReason) {
      alert(failReason);
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
