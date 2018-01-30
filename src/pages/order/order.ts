import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { appApis } from '../../providers/apis';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  public orderlsit:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,private httpService: HttpServiceProvider) {
  }

  ionViewDidLoad() {
    this.getOrderList();
    console.log('ionViewDidLoad OrderPage');
  }
  /*见闻列表*/
  getOrderList(){
    const getStr = {
      'type': '4002',
      'filters':{
            'id':localStorage.getItem('usid'),
      }
       
    };
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
      data => {
        console.log(data);
        if (data && data.data){
          this.orderlsit = data.data;
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
