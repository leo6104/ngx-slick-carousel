import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SlickCarouselComponent, SlickItemDirective} from './slick.component';

export * from './slick.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SlickCarouselComponent,
    SlickItemDirective,
  ],
  exports: [
    SlickCarouselComponent,
    SlickItemDirective,
  ]
})
export class SlickCarouselModule {
}
