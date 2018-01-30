import { Component } from '@angular/core';
import {ActionSheetController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";
import $ from 'jquery';
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
/**
 * Generated class for the PerfectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-perfect',
  templateUrl: 'perfect.html',
})
export class PerfectPage {
  myDate;
  porPath;
  subPath;
  nickname;
  sexName;
  birthday;
  constructor(public navCtrl: NavController, public navParams: NavParams,private httpService: HttpServiceProvider) {

  }
  ionViewDidLoad() {
    this.getUserList();
    $(function() {
      $("input[type='radio']").click(function(){
        $("input[type='radio'][name='"+$(this).attr('name')+"']").parent().removeClass("checked");
        $(this).parent().addClass("checked");
      });
    });
  }
  //  获得用户详情
  getUserList() {
    const getStr = {
      'type':  '0006',
      'filters': {
        'id': localStorage.getItem('usid')
      }
    };
    this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(getStr),
      data => {
        if (data) {
          if (data.data) {
            this.myDate = data.data.birthday;
            this.nickname = data.data.nickname;
            this.sexName = data.data.sex;
            this.porPath = data.data.profile;
          }
        }
      },
      error => {
        console.error(error);
      });
  }
  uploadFile($event): void {
    this.httpService.upload(appApis.upload_app_file,
      $event,
      data => {
        console.log(JSON.stringify(data.data));
        this.porPath = data.data.path;
        this.subPath = data.data.url;
      },
      error => {
        console.error(error);
      },
      "file")
  }
  /*提交信息*/
  subInfor(){
    console.log(this.myDate);
    const str = {
      "type":"0003",
      "key":localStorage.getItem("usid"),
      "data":{
        "nickname": this.nickname,
        "sex":this.sexName,
        "birthday":this.myDate,
        "profile":this.subPath
      },
      "operate":"A"
    };
    console.log(JSON.stringify(str));
    this.httpService.get(appApis.get_app_data+ '?postStr='+JSON.stringify(str),
      data => {
        if(data.code == 1){
            alert(data.msg);
          // this.porPath ="";
        }else{
            alert( data.msg)
        }

      },
      error => {
        console.error(error);
      })
  }
  toBack() {
    this.navCtrl.pop();
  }


}
