import { Component, Output, EventEmitter, Input  } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import $ from 'jquery';

@Component({
  selector: 'bombbox',
  templateUrl: 'bombbox.html'
})
export class BombboxComponent {
  @Input() id;
  @Output() messBox= new EventEmitter();
  primValue;
  newValue;
  reValue;
  primePhone;
  newPhone;
  phoneCode;
  messClase = true;
  canclick = true;
  code;
  data: any = [];
  countinterval3;
  time3 = 60;
  constructor(public navCtrl: NavController, public navParams: NavParams,private toastCtrl: ToastController,  private httpService: HttpServiceProvider) {
    this.getUserInfor();
  }
  /*获得用户信息*/
  getUserInfor(){
    const getStr = {
      'type': '0006',
      'filters': {
        'id': localStorage.getItem('usid')
      }
    };
    this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(getStr),
      data => {
        if(data && data.data){
          this.primePhone= data.data.mobile;
        }
      },
      error => {
        console.error(error);
      });
  }
  /*清除缓存*/
  toReserDel(){
    let toast = this.toastCtrl.create({
      message: '清除缓存成功！',
      duration: 1000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      this.messClase = false;
      this.messBox.emit(this.messClase);
    });

    toast.present();
  }
  /*更改密码*/
  changPW(){
    if(this.newValue === this.reValue&&this.primValue!=''&&this.newValue!=''){
      const postStr = {
        'type': '0004',
        'data': {
          'password': this.primValue,
          'newPass':  this.newValue ,
        },
        'operate': 'M',
        'key':localStorage.getItem('usid')
      };
      this.httpService.get(appApis.get_app_data + '?postStr=' + JSON.stringify(postStr),
        data => {
          if (data.code){
            alert( data.msg);
            this.messBox.emit(this.messClase);
          }else {
            alert(data.msg)
          }
        },
        error => {
          console.error(error);
        });
    }else{
      alert('新密码与重复密码不一致')
    }
  }
  /*==================*/
  // 发送验证码
  sendCode(): void {
    if ( this.newPhone === '' || !(/^1[3|4|5|8][0-9]\d{8}$/.test( this.newPhone ))) {
      alert('请填写正确的手机号');
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
      'mobile':this.newPhone,
      'type': '0001'
    };
    this.httpService.get(appApis.get_app_code + '?getStr=' + JSON.stringify(getStr),
      data => {
        if (data.code === 0) {
          alert(data.msg);
        }
        this.data = data;
        this.code = this.data.msg;
        let count = this.time3;
        if ( this.code === '发送验证码成功!') {
          this.countinterval3 = setInterval( () => {
            $('.sendcode').html(count + 's后重发');
            if (count <= 0) {
              count = this.time3;
              clearInterval(this.countinterval3);
              $('.sendcode').html('获取');
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
  /*更改手机号码*/
  changPhone(){
    if((this.newPhone === '' || !(/^1[3|4|5|8][0-9]\d{8}$/.test( this.newPhone ))) && (this.newPhone === '' || !(/^1[3|4|5|8][0-9]\d{8}$/.test( this.newPhone )))){
      alert('请填写正确的新手机号！');
    }else{
      const postStr = {
        'type': '0017',
        'data':{
          'old_mobile':this.primePhone,
          'new_mobile':this.newPhone,
          'vcode':this.phoneCode
        },
        'operate':'M',
        'key':localStorage.getItem('usid')
      }
      this.httpService.get(appApis.get_app_data + '?postStr=' + JSON.stringify(postStr),
        data => {
          if (data.code){
            alert( data.msg);
            this.messBox.emit(this.messClase);
          }else {
            alert(data.msg)
          }
        },
        error => {
          console.error(error);
        });
    }

  }
  /*返回*/
  toBack(){
    this.messClase = false;
    this.messBox.emit(this.messClase);
  }

}
