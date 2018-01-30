import {Component, OnInit} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import $ from 'jquery';
import {TasteDelPage} from "../taste-del/taste-del";
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";

@Component({
  selector: 'page-taste',
  templateUrl: 'taste.html',
})
export class TastePage implements OnInit{
  isNum = 1;
  tasteClaID='';
  tasteList:any = [];
  tasteNav: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,  private httpService: HttpServiceProvider) {

  }
  ngOnInit(): void {
    this.getTastCla();
    this.getTastList('');
  }
  /*蒙版分类的隐藏与显示*/
  showMeng(){
    this.isNum ++;
    if(this.isNum%2==0){
      $('#navTit').css('display','block').css('height',$('#tasteBox').height()- $('.tastTit').height());
    }else{
      $('#navTit').css('display','none');
    }
  }
  getClassList(id) {
    this.tasteClaID = id;
    this.isNum ++;
    this.getTastList(id);
    $('#navTit').css('display','none');
  }
  /*见闻分类列表*/
  getTastCla(){
    const getStr = {
      'type': '11002',
    };
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
      data => {
        console.log(data);
        if (data && data.data){
          this.tasteNav = data.data;
          this.tasteNav.unshift({id:'',name:'全部'});
        }
      },
      error => {
        console.error(error);
      });
  }
  /*见闻列表*/
  getTastList(tasid){
    this.tasteList = [];
    const getStr = {
      'type': '11000',
      'filters':{
        'classifyid':tasid
      }
    };
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
      data => {
        console.log(data);
        if (data && data.data){
          this.tasteList = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  toTastDel(tastId){
    this.navCtrl.push(TasteDelPage,{tastId: tastId});
  }
}
