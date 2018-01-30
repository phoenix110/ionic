import { Component, Input } from '@angular/core';
import { appApis } from '../../providers/apis';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the OrderlistComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'orderlist',
  templateUrl: 'orderlist.html'
})
export class OrderlistComponent {

  text: string;
  @Input() orderlist;
  constructor(private toastCtrl: ToastController,private httpService: HttpServiceProvider) {
    console.log('Hello OrderlistComponent Component');
    this.text = 'Hello World';
  }
  quxiao(id){
    const getStr = {
      'type': '4004',
      'key':id,
      'operate':'M'
    };
    this.httpService.get(appApis.get_app_data + '?postStr=' + JSON.stringify(getStr),
      data => {
      console.log(data.data);
        if (data && data.data) {
          let toast = this.toastCtrl.create({
            message: data.data.msg,
            duration: 3000,
            position: 'middle'
          });
        
          toast.onDidDismiss(() => {
            console.log('Dismissed toast');
          });
        
          toast.present();
        }
      },
      error => {
        console.error(error);
      });
  }
}
