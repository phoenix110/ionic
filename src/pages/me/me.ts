import {Component, OnInit} from '@angular/core';
import { MsgCenterPage } from '../msg-center/msg-center';
import { NavController } from 'ionic-angular';
import { SettingPage } from '../setting/setting';
import { PerfectPage } from '../perfect/perfect';
import { GuanzhuPage } from '../guanzhu/guanzhu';
import { ShoucangjiaPage } from '../shoucangjia/shoucangjia';
import { OrderPage } from '../order/order';
import { YijianPage } from '../yijian/yijian';
import { AboutusPage } from '../aboutus/aboutus';
import {LoginPage} from "../login/login";
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { appApis } from '../../providers/apis';

@Component({
  selector: 'page-me',
  templateUrl: 'me.html',
})
export class MePage implements OnInit{
  memsg={};
  constructor(public navCtrl: NavController,  private httpService: HttpServiceProvider) {
  }
  ngOnInit() {
    if(!localStorage.getItem('usid')){
      this.navCtrl.push(LoginPage);
    } else{
      const str = {
        'type': '0006',
        filters: {
          'id': localStorage.getItem('usid'),
          'accid': ''
        }
      };
      this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(str),
        data => {
          if (data.code === 1) {
            console.log(data);
            this.memsg = data.data;
          }
          if (data.code === 0) {
            alert(data.msg)
          }
        },
        error => {
          console.error(error);
        });
    }
  }
  ionViewDidLoad() {}
  open_msg(){
    this.navCtrl.push(MsgCenterPage);
  }
  open_setting(){
    this.navCtrl.push(SettingPage);
  }
  open_perfect(){
    this.navCtrl.push(PerfectPage);
  }
  open_guanzhu(){
    this.navCtrl.push(GuanzhuPage);
  }
  open_shoucangjia(){
    this.navCtrl.push(ShoucangjiaPage);
  }
  open_orderlist(){
    this.navCtrl.push(OrderPage);
  }
  open_yijian(){
    this.navCtrl.push(YijianPage);
  }
  open_about(){
    this.navCtrl.push(AboutusPage);
  }
}
