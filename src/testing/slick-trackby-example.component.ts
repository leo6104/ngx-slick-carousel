import { Component, ViewChild } from '@angular/core';
import { SlickCarouselComponent } from '../slick.component';


@Component({
  selector: 'slick-use-trackby-example',
  template: `
      <ngx-slick-carousel #slickModal="slick-carousel"
                          [config]="slideConfig"
                          (init)="slickInit($event)"
                          (breakpoint)="breakpoint($event)"
                          (afterChange)="afterChange($event)"
                          (beforeChange)="beforeChange($event)">
          <div ngxSlickItem *ngFor="let slide of slides; trackBy: _trackBy" class="slide">
              <img src="{{ slide.img }}" alt="" width="100%">
          </div>
      </ngx-slick-carousel>

      <button (click)="addSlide()">Add</button>
      <button (click)="removeSlide()">Remove</button>
      <button (click)="slickModal.slickGoTo(2)">slickGoto 2</button>
      <button (click)="slickModal.unslick()">unslick</button>
  `,
  standalone: false
})
export class SlickTrackbyExampleComponent {
  @ViewChild('slickModal', { static: true }) slickModal: SlickCarouselComponent;

  slides = [
    { img: 'http://placehold.it/350x150/000000' },
    { img: 'http://placehold.it/350x150/111111' },
    { img: 'http://placehold.it/350x150/333333' },
    { img: 'http://placehold.it/350x150/666666' }
  ];
  slideConfig = { 'slidesToShow': 4, 'slidesToScroll': 4 };

  _trackBy(slide) {
    return slide.img;
  }

  addSlide() {
    this.slides.push({ img: 'http://placehold.it/350x150/777777' })
  }

  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

  slickInit(e) {
    console.log('slick initialized');
  }

  breakpoint(e) {
    console.log('breakpoint');
  }

  afterChange(e) {
    console.log('afterChange');
  }

  beforeChange(e) {
    console.log('beforeChange');
  }
}
