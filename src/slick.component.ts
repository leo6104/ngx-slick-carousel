import {
  Component,
  Input,
  Output,
  EventEmitter,
  NgZone,
  forwardRef,
  AfterViewInit,
  OnDestroy,
  Directive,
  ElementRef,
  Host,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {isPlatformBrowser} from '@angular/common';

declare const jQuery: any;

/**
 * Slick component
 */
@Component({
  selector: 'ngx-slick-carousel',
  exportAs: 'slick-carousel',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SlickCarouselComponent),
    multi: true
  }],
  template: '<ng-content></ng-content>',
})
export class SlickCarouselComponent implements AfterViewInit, OnDestroy {

  @Input() config: any;
  @Output() afterChange: EventEmitter<any> = new EventEmitter();
  @Output() beforeChange: EventEmitter<any> = new EventEmitter();
  @Output() breakpoint: EventEmitter<any> = new EventEmitter();
  @Output() destroy: EventEmitter<any> = new EventEmitter();
  @Output() init: EventEmitter<any> = new EventEmitter();


  public slides: any = [];
  public $instance: any;
  private initialized: Boolean = false;
  public currentIndex: number;

  /**
   * Constructor
   */
  constructor(private el: ElementRef,
              private zone: NgZone) {

  }

  /**
   * On component destroy
   */
  ngOnDestroy() {
    this.unslick();
  }

  /**
   * On component view init
   */
  ngAfterViewInit() {
  }

  /**
   * init slick
   */
  initSlick() {
    this.zone.runOutsideAngular(() => {
      this.$instance = jQuery(this.el.nativeElement);

      this.$instance.on('init', (event, slick) => {
        this.zone.run(() => {
          this.init.emit({event, slick});
        });
      });

      this.$instance.slick(this.config);

      this.zone.run(() => {
        this.initialized = true;

        this.currentIndex = (this.config && this.config.initialSlide) ? this.config.initialSlide : 0;
      });

      this.$instance.on('afterChange', (event, slick, currentSlide) => {
        this.zone.run(() => {
          this.afterChange.emit({event, slick, currentSlide});
          this.currentIndex = currentSlide;
        });
      });

      this.$instance.on('beforeChange', (event, slick, currentSlide, nextSlide) => {
        this.zone.run(() => {
          this.beforeChange.emit({event, slick, currentSlide, nextSlide});
        });
      });

      this.$instance.on('breakpoint', (event, slick, breakpoint) => {
        this.zone.run(() => {
          this.breakpoint.emit({event, slick, breakpoint});
        });
      });

      this.$instance.on('destroy', (event, slick) => {
        this.zone.run(() => {
          this.destroy.emit({event, slick});
        });
      });
    });
  }

  addSlide(slickItem: SlickItemDirective) {
    if (!this.initialized) {
      this.initSlick();
    }

    this.slides.push(slickItem);
    this.$instance.slick('slickAdd', slickItem.el.nativeElement);
  }

  removeSlide(slickItem: SlickItemDirective) {
    const idx = this.slides.indexOf(slickItem);
    this.$instance.slick('slickRemove', idx);
    this.slides = this.slides.filter(s => s !== slickItem);
  }

  /**
   * Slick Method
   */
  public slickGoTo(index: number) {
    this.zone.run(() => {
      this.$instance.slick('slickGoTo', index);
    });
  }

  public slickNext() {
    this.zone.run(() => {
      this.$instance.slick('slickNext');
    });
  }


  public slickPrev() {
    this.zone.run(() => {
      this.$instance.slick('slickPrev');
    });
  }

  public slickPause() {
    this.zone.run(() => {
      this.$instance.slick('slickPause');
    });
  }

  public slickPlay() {
    this.zone.run(() => {
      this.$instance.slick('slickPlay');
    });
  }

  public unslick() {
    this.zone.run(() => {
      this.$instance.slick('unslick');
      this.initialized = false;
    });
  }



}

@Directive({
  selector: '[ngxSlickItem]',
})
export class SlickItemDirective implements AfterViewInit, OnDestroy {
  constructor(public el: ElementRef,
              @Inject(PLATFORM_ID) private platformId: string,
              @Host() private carousel: SlickCarouselComponent) {
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.carousel.addSlide(this);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.carousel.removeSlide(this);
    }
  }
}
