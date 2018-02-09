import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {appApis} from "../../providers/apis";
import {Coordination} from "../../stateStore/log.store";
import {Store} from "@ngrx/store";
import {CHOSED_ITEM} from "../../stateStore/action";

/**
 * Generated class for the MapSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-map-search',
  templateUrl: 'map-search.html',
})
export class MapSearchPage {
searchNav = [
  { id: 0, tit: '活动',type: '400004'},
  { id: 1, tit: '场馆',type: '300001'},
  { id: 2, tit: '景点',type: '1300001'}
];
searchIndex = 1;
sList = [
  '青岛市图书馆',
  '冰火魔术！让孩子爱上科学冰火魔术！让孩子爱上科学冰火魔术！让孩子爱上科学冰火魔术！让孩子爱上科学',
  '八大关，近代西式别墅群'
];
lon:any;//当前调用接口所用坐标
lat:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpServiceProvider,
    private store: Store<Coordination>
  ) {
  this.lon = this.navParams.get('lon');
  this.lat = this.navParams.get('lat');
  }

  ionViewDidLoad() {
    this.getData('300001')
  }
// 返回地图
  backToMap (){
    this.navCtrl.pop();
  }
  changeNav(s) {
    this.searchIndex = s.id;
    this.getData(s.type);
  }
  // 获取活动/场馆/景点的数据
  getData(type) {
    this.sList = null;
    if(type) {
      const str = {
        "type":type,
        "filters": {
          "lon":this.lon,
          "lat":this.lat,
          "distance":100
        }
      };
      this.httpService.get(appApis.get_app_data+'?getStr='+JSON.stringify(str),
        data => {
          if(data.code === 1){
            this.sList = data.data;
          }
        },
        error=> {
          console.log(JSON.stringify(error));
        })
    }
  }
  // 带参路由跳转
  toNav(l) {
    this.store.dispatch({type:CHOSED_ITEM,payload:{
      item:l,
      id:this.searchIndex
    }});
    this.navCtrl.pop();
  };
}
