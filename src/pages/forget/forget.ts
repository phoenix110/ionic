import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import $ from 'jquery';
import {appApis} from "../../providers/apis";
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-forget',
  templateUrl: 'forget.html',
})
export class ForgetPage {
  phoneValue;
  codeValue;
  pwValue;
  rePwValue;
  canclick = true;
  code;
  data: any = [];
  countinterval3;
  time3 = 60;
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServiceProvider) {
  }

  ionViewDidLoad() {

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
    const getStr = {
      'mobile':this.phoneValue,
      'type': '0005'
    }
    console.log(getStr)
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
  // 确认修改
  changeWord(): void {
    if ( this.phoneValue === '' || !(/^1[3|4|5|8][0-9]\d{8}$/.test( this.phoneValue + '' ))) {
      alert('请填写正确的手机号');
    }else if(this.pwValue != this.rePwValue){
      alert('两次密码不一致');
    } else{
      const postStr = {
        'type': '0005',
        'data': {
          'mobile': this.phoneValue,
          'vcode':  this.codeValue ,
          'password': this.rePwValue
        },
        'operate': 'M'
      };
      this.httpService.get(appApis.get_app_data + '?postStr=' + JSON.stringify(postStr),
        data => {
          if (data.code){
            this.data = data;
            alert( data.msg)
            this.navCtrl.push(LoginPage);
            return this.data;
          }else {
            alert(data.msg)
          }
        },
        error => {
          console.error(error);
          return this.data;
        });
    }
  }
  toLogin(){
    this.navCtrl.pop();
  }
}
