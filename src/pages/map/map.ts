import {Component, OnInit, OnDestroy} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import $ from 'jquery';
import {Subscription} from "rxjs/Subscription";
import {Coordination, Region} from "../../stateStore/log.store";
import {Store} from "@ngrx/store";
import {Geolocation} from "@ionic-native/geolocation";
import {MapSearchPage} from "../map-search/map-search";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {appApis} from "../../providers/apis";
import {CLEAR_STATUS} from "../../stateStore/action";
declare let BMap: any;
/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage implements OnInit,OnDestroy{

  map:any;          // 创建地图实例
  color:string[]=['#ff9623','#0aa5ff','#80d35d']; // 活动/场馆/景点标记点的的颜色
  v = 1; // color属性索引
  mapNav = [
    {id:0,tit:'活动',port:'400004'},
    {id:1,tit:'场馆',port:'300001'},
    {id:2,tit:'景点',port:'1300001'}
  ]; // 底部导航栏
  portNow:any = '300001'; // 当前导航栏类型的接口type
  mapIndex = 1; // 控制底部导航栏切换
  eY:any;
  top:any;
  s:Subscription;
  sb:Subscription;
  location:any = null;// 当前定位城市
  DIT:any;// 弹出框top值
  conHeight:any; // 弹出框高度
  labels:any=[];//点标记集合
  texts:any = []; // 文本标记集合
  data:any; // 场馆/活动/景点数据
  isGps=false; // 回传给组件，控制导航图标的显示隐藏
  lonlat = {
    "lon":null,
    "lat":null
  }; // 当前调用接口所用坐标
  mylon:any;// 用户定位坐标
  mylat:any;
  chosedData:any = null; // 被选中点的数据
  canZoom = true; //控制定位标记缩放不消失
  canGps = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private store:Store<Region>,
    private st:Store<Coordination>,
    private httpService: HttpServiceProvider,
    public alertCtrl: AlertController,
    private geolocation:Geolocation
    ) {}
  ngOnInit(): void {}
  ionViewDidLoad() {
    // 获取路由数据
    const that = this;
    this.DIT = Number.parseInt($('#con').css('top')); // 弹出框top值
    this.conHeight = Number.parseInt($('#con').css('height'));
    // 上拉框
    $('#map_drag').on('touchstart',function ($event) {
      that.eY = Number.parseInt($('#con').css('top'));
      if (that.eY >= that.DIT) {
        $('#con').animate({'top':`-${that.conHeight}px`},1000);
      } else {
        $('#con').animate({'top':`${that.DIT}px`},1000);
      }
    });
    const page = document.getElementById('container');
    const ch = document.body.clientHeight;
    page.setAttribute('style',
      `height:${ch}px;`);
    // 初始化地图并定位
    this.map = new BMap.Map("container");          // 创建地图实例
    this.mapEventBind(0);// 地图事件绑定
    this.getPosition(0); // 默认获取定位城市附近活动/场馆/景点信息
  }
  ionViewDidEnter() {
    this.sb = this.st.select(('cdt' as any)).subscribe((cod)=>{
      if(cod.coord){
        this.gps(cod.coord);
      }
      if(cod.chosedData.item){
        // for(let i =0; i<this.labels.length;i++){
        //   this.map.removeOverlay(this.labels[i]);// 删除单个标记点
        // }
        const cd = cod.chosedData.item.coordinates.split(',');
        let point = new BMap.Point(cd[0], cd[1]);  // 创建点坐标
        console.log(JSON.stringify(point));
        this.map.setCenter(point);
        // this.map.centerAndZoom(point, 11);
        this.map.clearOverlays();
        this.mapIndex = cod.chosedData.id;
        this.addChosedtable(cod.chosedData.item);
        $('#con').animate({'top':'-256px'},1000); // 弹出框弹出
      }
    })
  }
  ionViewDidLeave() {
    this.store.dispatch({type:CLEAR_STATUS});// 重置store
    $('#con').animate({'top':`${this.DIT}px`},1000);
    this.sb.unsubscribe();
  }
  ngOnDestroy(): void {
    this.store.dispatch({type:CLEAR_STATUS});// 重置store
    if(this.s) {
      this.s.unsubscribe();// 取消订阅
    }
  }
  // 地图事件绑定
  mapEventBind(v) {
    const that = this;
    // 监听地图拖拽结束
    this.map.addEventListener('dragend',function () {
      if(!that.canGps){
        that.getCenter();
      }
    });
    // 监听地图缩放
    this.map.addEventListener('zoomend',function () {
      // console.log("地图缩放至：" + this.getZoom() + "级");
      if (that.canZoom && !that.canGps) {
        if(this.getZoom() >= 12 ) {
          that.map.clearOverlays();
          that.addMapLabel2(that.v);
          if (that.chosedData) {
            that.addChosedText(that.chosedData[0]);
          }
        } else {
          that.map.clearOverlays();
          that.addMapLabel(that.v);
          if (that.chosedData) {
            that.addChosedtable(that.chosedData[0]);
          }
        }
      }
    });
  }
  // 获取用户位置并获取初始数据
  getPosition(n) {
    const that = this;
    let geolocation = new BMap.Geolocation();
    $('#con').animate({'top':`${this.DIT}px`},1000);
    this.geolocation.getCurrentPosition().then((resp) => {
      [that.lonlat.lon,that.mylon] = [resp.coords.longitude.toString(),resp.coords.longitude.toString()];
      [that.lonlat.lat,that.mylat] = [resp.coords.latitude.toString(),resp.coords.latitude.toString()];
      console.log('-----'+that.lonlat.lon+'===='+that.lonlat.lat);
      let geoc = new BMap.Geocoder();
      let pt = new BMap.Point(resp.coords.longitude,resp.coords.latitude);
      geoc.getLocation(pt, function(rs){
        let addComp = rs.addressComponents;
        // alert(addComp.city );
        that.location = addComp.city; // 当前定位城市

      });
      if(n) { // 如果用户点击定位按钮，显示定位点
        that.map.clearOverlays();
        let marker = new BMap.Marker(pt);
        that.map.addOverlay(marker);
        that.map.panTo(pt);
        that.canZoom = false;
      } else {
        that.subRegion();
      }
    }).catch((error) => {
      // console.log('Error getting location', error);
      //用户拒绝,默认定位到济南
      this.map.centerAndZoom('济南市');
      let myGeo = new BMap.Geocoder();
      // 将地址解析结果显示在地图上,并调整地图视野
      myGeo.getPoint("历城区二环东路2912号", function(point){
        if (point) {
          that.map.centerAndZoom(point, 16);
          [that.lonlat.lon,that.mylon] = [point.lng,point.lng];
          [that.lonlat.lat,that.mylat] = [point.lat,point.lat];
          that.getData(that.lonlat.lon ,that.lonlat.lat,1,'300001');// 默认获取场馆数据
        }
      }, "济南市");
    });
  }
  // 订阅store
   subRegion() {
    const param = !!this.navParams.get('item');
    this.s = this.store.select(('region' as any)).subscribe((log)=>{// 订阅
      if( this.location !== log.city && this.location!=null && !param && log.city) {
        const if_switch = confirm(`当前定位城市为${this.location},是否切换`);
        if(if_switch){
          // this.map.setCenter(log.city);.
          const that = this;
          this.map.centerAndZoom(log.city);
          this.map.addEventListener('load',function(){// load事件 这表示地图位置、缩放层级已经确定，但可能还在载入地图图块
            that.getCenter();// 待地图初始化结束后获取地图中心点附近活动/场馆/景点信息
          });
        } else {
        this.initMap(this.lonlat.lon,this.lonlat.lat);
        this.getData(this.lonlat.lon ,this.lonlat.lat,1,'300001');// 默认获取场馆数据
        }
      } else {
        this.initMap(this.lonlat.lon,this.lonlat.lat);
        this.getData(this.lonlat.lon ,this.lonlat.lat,1,'300001');// 默认获取场馆数据
      }
    });
  }
  // 初始化地图中心点
  initMap(lon,lat) {
    let point = new BMap.Point(lon, lat);  // 创建点坐标
    this.map.centerAndZoom(point, 11);
  }
  // 获取地图中心点
  getCenter () {
    const ct = this.map.getCenter();
    this.lonlat.lon = ct.lng;
    this.lonlat.lat = ct.lat;
    this.getData(ct.lng,ct.lat,this.v,this.portNow);// 默认获取地图中心点附近场馆数据
  }
  // zoom <= 12时向地图添加圆点标注
   addMapLabel(v) {
     this.map.clearOverlays(); //清除所有覆盖物
     if(this.data) {
       const l = this.data.length;
       for (let i = 0; i < l; i++) {
         this.addLabel(this.data[i],v);
       }
     }
  }
   addLabel(item,v) {
     const that = this;
    const lola = item.coordinates.split(',');
     let option = {
        position: new BMap.Point(lola[0], lola[1])
      };
      let label = new BMap.Label(' ', option);  // 创建文本标注对象
      label.setStyle({
        position:'absolue',
        color: "white",
        backgroundColor: this.color[v],
        height: "0.403rem",
        width: "0.403rem",
        opacity: 1,
        textAlign: "center",
        borderWidth:'.048rem',
        borderStyle:'solid',
        borderColor:'#ffffff',
        borderRadius: "50%",
        zIndex:'1',
      });
        label.addEventListener('click',function() {
          for(let i =0; i<that.labels.length;i++){
            that.map.removeOverlay(that.labels[i]);// 删除单个标记点
          }
          // const firstH = Number.parseInt($('.map-box').css('height'));
          // const mT =Number.parseInt($('.map-box').css('margin-top'));
          $('#con').animate({'top':'-256px'},1000);
          that.addChosedtable(item);
        });
      this.map.addOverlay(label);
  }
  // zoom > 12时向地图添加文本标注
  addMapLabel2(v) {
    this.map.clearOverlays(); //清除所有覆盖物
    if(this.data) {
      const l = this.data.length;
      for (let i = 0; i < l; i++) {
        this.addLabel2(this.data[i],v);
      }
    }
  }
  addLabel2(item,v) {
    const that = this;
    const lola = item.coordinates.split(',');
    let option = {
      position: new BMap.Point(lola[0],lola[1])
    };
    let label = new BMap.Label(item.name, option);  // 创建文本标注对象
    label.setStyle({
      position:'absolue',
      color: "white",
      fontSize:"0.402rem",
      backgroundColor:this.color[v],
      borderRadius: "10%",
      padding:'0.1rem',
      border:'none',
      zIndex:'1',
    });
    label.addEventListener('click',function() {
      for(let i =0; i<that.texts.length;i++){
        that.map.removeOverlay(that.texts[i]);// 删除单个标记点
      }
      $('#con').animate({'top':'-256px'},1000);
      that.addChosedText(item);
    });
    this.map.addOverlay(label);
  }
  // 被选中点
  addChosedtable(item) {
    this.isGps = true;
    this.chosedData = null;
    this.chosedData=[item];
    const lola = item.coordinates.split(',');
    let option = {
      position: new BMap.Point(lola[0], lola[1])
    };
    let label = new BMap.Label(' ', option);  // 创建文本标注对象
    label.setStyle({
      position:'absolue',
      color: "white",
      backgroundImage:"url('assets/imgs/map.png')",
      backgroundSize:"cover",
      height: "0.403rem",
      width: "0.403rem",
      opacity: 1,
      textAlign: "center",
      borderWidth:'.048rem',
      borderStyle:'solid',
      borderColor:'#ffffff',
      borderRadius: "50%",
      zIndex:'100',
    });
    this.map.addOverlay(label);
    this.labels.push(label); // 收集被选中标记点
  }
// 被选中文本
  addChosedText(item) {
    this.isGps = true;
    this.chosedData = null;
    this.chosedData=[item];
    const lola = item.coordinates.split(',');
    let option = {
      position: new BMap.Point(lola[0],lola[1])
    };
    let text = new BMap.Label(item.name, option);  // 创建文本标注对象
    text.setStyle({
      position:'absolue',
      color: "white",
      fontSize:"0.402rem",
      padding:'0.1rem',
      backgroundColor:'red',
      borderRadius: "10%",
      zIndex:'100',
    });
    this.map.addOverlay(text);
    this.texts.push(text); // 收集被选中标记文本
  }
  // 活动/场馆/景点切换
  switchOver(m) {
    this.initMap(this.lonlat.lon,this.lonlat.lat);
    this.canGps = false;
    this.isGps = false;
    this.mapIndex = m.id;
    this.chosedData = null;
    this.canZoom = true;
    if(m.port){
      this.portNow = m.port;
      this.getData(this.lonlat.lon, this.lonlat.lat,m.id,m.port);
    }
  }
  // 获取活动/ 场馆/ 景点数据
  getData(lon,lat,v,port){
    this.data = null;
    this.v = v;
    const str = {
      "type":port,
      "filters": {
        "lon":lon,
        "lat":lat,
        "distance":100
      }
    };
    this.httpService.get(appApis.get_app_data+'?getStr='+JSON.stringify(str),
      data => {
        if(data.code === 1){
          this.data= data.data;
          if(this.map.getZoom() >= 12 ) {
            this.addMapLabel2(v);
            if (this.chosedData) {
              this.addChosedText(this.chosedData[0]);
            }
          } else {
            this.addMapLabel(v);
            if (this.chosedData) {
              this.addChosedtable(this.chosedData[0]);
            }
          }
        } else {
          // this.map.clearOverlays(); //清除所有覆盖物
          $('#con').animate({'top':`${this.DIT}px`},1000);
        }
      },
      error=> {
        console.log(JSON.stringify(error));
      })
  }
  // 导航
  gps(coord) {
    $('#con').animate({'top':`${this.DIT}px`},1000);
    this.map.clearOverlays();
    const lola = (coord as string).split(',');
    // console.log(lola[0]+'---'+lola[1]);
    let p1 = new BMap.Point(lola[0], lola[1]);
    let p2 = new BMap.Point(this.mylon ,this.mylat);

    let driving = new BMap.DrivingRoute(this.map, {renderOptions:{map: this.map}});
    driving.search(p2, p1);
    this.canGps = true;
  }
  // 回到上一页
  back() {
    this.navCtrl.pop();
  }
  // 跳转到搜索页面
  toMapSearch() {
    this.navCtrl.push(MapSearchPage,{
      'lon':this.lonlat.lon,
      'lat':this.lonlat.lat
    });
  }
}
