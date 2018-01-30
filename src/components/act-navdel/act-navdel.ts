import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
declare let Swiper: any;
import $ from 'jquery';

@Component({
  selector: 'act-navdel',
  templateUrl: 'act-navdel.html'
})
export class ActNavdelComponent implements OnInit {
  actIndex = '';
  navList: any = [];
  @Output() recAct= new EventEmitter();
  constructor(public navCtrl: NavController, private httpService: HttpServiceProvider) {

  }
  ngOnInit(): void {
    this.getActCla();
   new Swiper('.swiper-container', {
      observer: true, // 修改swiper自己或子元素时，自动初始化swiper
      observeParents: true, // 修改swiper的父元素时，自动初始化swiper
      slidesPerView: 5,
      paginationClickable: true,
    });
    setTimeout(() => {
      $('.swiper-wrapper').css('transform','translate3d(0,0,0)')
    },100)

  }

  getData(id) {
    this.actIndex = id;
    this.recAct.emit(id);
  }
// 获得活动分类
  getActCla() {
    const getStr = '?getStr={\'type\':\'400001\'}';
    this.httpService.get(appApis.get_app_data + getStr,
      data => {
        if (data) {
          this.navList = data.data;
          this.navList.unshift({id:'',name:'全部'});
          console.log(this.navList);
        }
      },
      error => {
        console.error(error);
      });
  }
}
