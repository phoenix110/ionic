import { Component,Input } from '@angular/core';
declare let Swiper: any;
/**
 * Generated class for the LunboTopComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'lunbo-top',
  templateUrl: 'lunbo-top.html'
})
export class LunboTopComponent {
  @Input() lunbTopList;

  constructor() {

  }
  ngOnInit(): void {
    setTimeout(() => {
      new Swiper ('.swiper-container', {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        
        })
    }, 500);
  
  }

}
