import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import $ from 'jquery';
import {LoginPage} from "../login/login";
import { NavPage } from '../nav/nav';

@Component({
  selector: 'page-regist',
  templateUrl: 'regist.html',
})
export class RegistPage {
  nicknameValue;
  phoneValue;
  codeValue;
  pwValue;
  canclick = true;
  code;
  data: any = [];
  countinterval3;
  time3 = 60;
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServiceProvider) {
  }

  ionViewDidLoad() {
    // 根据设备尺寸固定页面尺寸，解决软键盘弹出压缩页面的问题
    const page = document.getElementsByClassName('ion-page')[0];
    const ch = document.body.clientHeight;
    const cw = document.body.clientWidth;
    page.setAttribute('style', `height:${ch}px; width:${cw}px`);

  }
  // 发送验证码
  sendCode(): void {
    if ( this.phoneValue === '' || !(/^1[3|4|5|8][0-9]\d{8}$/.test( this.phoneValue ))) {
      alert('请填写正确的手机号');
      console.log(this.phoneValue);
    }else {
      if (this.canclick) {
        this.sCode();
      } else {
        return;
      }
    }
  }
  sCode() {
    // const token = localStorage.getItem('token');
    const getStr = {
      'mobile':this.phoneValue,
      'type': '0001'
    }
    // const getStr = '?getStr={\'mobile\':\'' + this.rPhone + '\',\'token\':\'' + token + '\',\'type\':\'0001\'}';
    this.httpService.get(appApis.get_app_code + '?getStr=' + JSON.stringify(getStr),
      data => {
        if (data.code === 0) {
          alert(data.msg);
        }
        this.data = data;
        // $('.safeCode').html(this.data.msg);
        this.code = this.data.msg;
        let count = this.time3;
        if ( this.code === '发送验证码成功!') {
          this.countinterval3 = setInterval( () => {
            $('.code').html(count + 's后重发');
            if (count <= 0) {
              count = this.time3;
              clearInterval(this.countinterval3);
              $('.code').html('获取');
              this.canclick = true;
            }else {
              count--;
            }
          }, 1000);
          this.canclick = false;
        }
        return this.data;
      },
      error => {
        console.error(error);
        return this.data;
      });
  }
  // 注册
  register(): void {
    if ( this.phoneValue === '' || !(/^1[3|4|5|8][0-9]\d{8}$/.test( this.phoneValue ))) {
      alert('请填写正确的手机号');
    } else {
      const postStr = {
        'type': '0001',
        'data': {
          'nickname':this.nicknameValue,
          'mobile': this.phoneValue,
          'vcode': this.codeValue,
          'password': this.pwValue
        },
        'operate': 'A'
      };
      console.log(postStr);
      this.httpService.get(appApis.get_app_data + '?postStr=' + JSON.stringify(postStr),
        data => {
          if (data.code) {
            this.data = data;
            alert(data.msg);
            this.navCtrl.push(LoginPage);
            return this.data;
          } else {
            alert(data.msg);
          }
        },
        error => {
          console.error(error);
          return this.data;
        });
    }
  }
  toLogin(){
    this.navCtrl.push(LoginPage);
  }
  toback(){
    this.navCtrl.popToRoot();
  }
}
