import { isPlatformServer } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

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
export class SlickCarouselComponent implements OnDestroy, OnChanges, AfterViewInit, AfterViewChecked {

    @Input() config: any;
    @Output() afterChange: EventEmitter<{ event: any, slick: any, currentSlide: number, first: boolean, last: boolean }> = new EventEmitter();
    @Output() beforeChange: EventEmitter<{ event: any, slick: any, currentSlide: number, nextSlide: number }> = new EventEmitter();
    @Output() breakpoint: EventEmitter<{ event: any, slick: any, breakpoint: any }> = new EventEmitter();
    @Output() destroy: EventEmitter<{ event: any, slick: any }> = new EventEmitter();
    @Output() init: EventEmitter<{ event: any, slick: any }> = new EventEmitter();

  public $instance: any;

  // access from parent component can be a problem with change detection timing. Please use afterChange output
  private currentIndex = 0;

  public slides: any[] = [];
  public initialized = false;
  private _removedSlides: SlickItemDirective[] = [];
  private _addedSlides: SlickItemDirective[] = [];

  private el = inject(ElementRef);
  private zone = inject(NgZone);
  private isServer = isPlatformServer(inject(PLATFORM_ID));

  /**
   * On component destroy
   */
  ngOnDestroy() {
    this.unslick();
  }

  ngAfterViewInit(): void {
    this.ngAfterViewChecked();
  }

  /**
   * On component view checked
   */
  ngAfterViewChecked() {
    if (this.isServer) {
      return;
    }
    if (this._addedSlides.length > 0 || this._removedSlides.length > 0) {
      const nextSlidesLength = this.slides.length - this._removedSlides.length + this._addedSlides.length;
      if (!this.initialized) {
        if (nextSlidesLength > 0) {
          this.initSlick();
        }
        // if nextSlidesLength is zere, do nothing
      } else if (nextSlidesLength === 0) { // unslick case
        this.unslick();
      } else {
        this._addedSlides.forEach(slickItem => {
          this.slides.push(slickItem);
          this.zone.runOutsideAngular(() => {
            this.$instance.slick('slickAdd', slickItem.el.nativeElement);
          });
        });
        this._addedSlides = [];

        this._removedSlides.forEach(slickItem => {
          const idx = this.slides.indexOf(slickItem);
          this.slides = this.slides.filter(s => s !== slickItem);
          this.zone.runOutsideAngular(() => {
            this.$instance.slick('slickRemove', idx);
          });
        });
        this._removedSlides = [];
      }
    }
  }

  /**
   * init slick
   */
  initSlick() {
    this.slides = this._addedSlides;
    this._addedSlides = [];
    this._removedSlides = [];
    this.zone.runOutsideAngular(() => {
      this.$instance = jQuery(this.el.nativeElement);

      this.$instance.on('init', (event, slick) => {
        this.zone.run(() => {
          this.init.emit({ event, slick });
        });
      });

      this.$instance.slick(this.config);

      this.zone.run(() => {
        this.initialized = true;

        this.currentIndex = this.config?.initialSlide || 0;
      });

      this.$instance.on('afterChange', (event, slick, currentSlide) => {
        this.zone.run(() => {
            this.afterChange.emit({
                event,
                slick,
                currentSlide,
                first: currentSlide === 0,
                last: slick.$slides.length === currentSlide + slick.options.slidesToScroll
            });
            this.currentIndex = currentSlide;
        });
      });

      this.$instance.on('beforeChange', (event, slick, currentSlide, nextSlide) => {
        this.zone.run(() => {
          this.beforeChange.emit({ event, slick, currentSlide, nextSlide });
          this.currentIndex = nextSlide;
        });
      });

      this.$instance.on('breakpoint', (event, slick, breakpoint) => {
        this.zone.run(() => {
          this.breakpoint.emit({ event, slick, breakpoint });
        });
      });

      this.$instance.on('destroy', (event, slick) => {
        this.zone.run(() => {
          this.destroy.emit({ event, slick });
          this.initialized = false;
        });
      });
    });
  }

  addSlide(slickItem: SlickItemDirective) {
    this._addedSlides.push(slickItem);
  }

  removeSlide(slickItem: SlickItemDirective) {
    this._removedSlides.push(slickItem);
  }

  /**
   * Slick Method
   */
  public slickGoTo(index: number) {
    this.zone.runOutsideAngular(() => {
      this.$instance.slick('slickGoTo', index);
    });
  }

  public slickNext() {
    this.zone.runOutsideAngular(() => {
      this.$instance.slick('slickNext');
    });
  }

  public slickPrev() {
    this.zone.runOutsideAngular(() => {
      this.$instance.slick('slickPrev');
    });
  }

  public slickPause() {
    this.zone.runOutsideAngular(() => {
      this.$instance.slick('slickPause');
    });
  }

  public slickPlay() {
    this.zone.runOutsideAngular(() => {
      this.$instance.slick('slickPlay');
    });
  }

  public unslick() {
    if (this.$instance) {
      this.zone.runOutsideAngular(() => {
        this.$instance.slick('unslick');
      });
      this.$instance = undefined;
    }
    this.initialized = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialized) {
      const config = changes['config'];
      if (config.previousValue !== config.currentValue && config.currentValue !== undefined) {
        const refresh = config.currentValue['refresh'];
        const newOptions = Object.assign({}, config.currentValue);
        delete newOptions['refresh'];

        this.zone.runOutsideAngular(() => {
          this.$instance.slick('slickSetOption', newOptions, refresh);
        });
      }
    }
  }

}

@Directive({
  selector: '[ngxSlickItem]',
})
export class SlickItemDirective implements OnInit, OnDestroy {
  private carousel = inject(SlickCarouselComponent, { host: true });

  renderer = inject(Renderer2);
  el = inject(ElementRef);
  isServer = isPlatformServer(inject(PLATFORM_ID));

  ngOnInit() {
    this.carousel.addSlide(this);
    if (this.isServer && this.carousel.slides.length > 0) {
      // Do not show other slides in server side rendering (broken ui can be affacted to Core Web Vitals)
      this.renderer.setStyle(this.el, 'display', 'none');
    }
  }

  ngOnDestroy() {
    this.carousel.removeSlide(this);
  }
}
