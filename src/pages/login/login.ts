import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegistPage } from '../regist/regist';
import { ForgetPage } from '../forget/forget';
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {NavPage} from "../nav/nav";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  phoneValue;
  pwValue;
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServiceProvider) {
    
  }

  ionViewDidLoad() {}
  // 确认登录
  login() {
    if ( this.phoneValue === '' || !(/^1[3|4|5|8][0-9]\d{8}$/.test( this.phoneValue ))) {
      alert('请填写正确的手机号');
      return;
    }
    const str = {
      'type': '0002',
      filters: {
        'loginname': this.phoneValue,
        'password': this.pwValue
      }
    };
    this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(str),
      data => {
        if (data.code === 1) {
          alert(data.msg);
          this.navCtrl.pop();
          localStorage.setItem('usid', data.data.id);
          localStorage.setItem('mobile',data.data.mobile)
        }
        if (data.code === 0) {
          alert(data.msg)
        }
      },
      error => {
        console.error(error);
      });
  }
  regist(){
    this.navCtrl.push(RegistPage);
  }
  wangji(){
    this.navCtrl.push(ForgetPage);
  }
  // 游客模式
  visitor() {
    this.navCtrl.popToRoot();
  }
  
}
