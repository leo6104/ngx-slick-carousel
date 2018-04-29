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

declare const $: any;

/**
 * Slick component
 */
@Component({
  selector: 'ngx-slick-carousel',
  exportAs: 'slick-modal',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SlickComponent),
    multi: true
  }],
  template: '<ng-content></ng-content>',
})
export class SlickComponent implements AfterViewInit, OnDestroy {

  @Input() config: any;
  @Output() afterChange: EventEmitter<any> = new EventEmitter();
  @Output() beforeChange: EventEmitter<any> = new EventEmitter();
  @Output() breakpoint: EventEmitter<any> = new EventEmitter();
  @Output() destroy: EventEmitter<any> = new EventEmitter();

  public slides: any = [];
  public $instance: any;
  private initialized: Boolean = false;

  /**
   * Constructor
   */
  constructor(private el: ElementRef,
              private zone: NgZone,
              @Inject(PLATFORM_ID) private platformId: string) {

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
      this.$instance = $(this.el.nativeElement).slick(this.config);
      this.initialized = true;

      this.$instance.on('afterChange', (event, slick, currentSlide) => {
        this.zone.run(() => {
          this.afterChange.emit({event, slick, currentSlide});
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
    });
  }

}

@Directive({
  selector: '[ngxSlickItem]',
})
export class SlickItemDirective implements AfterViewInit, OnDestroy {
  constructor(public el: ElementRef, @Host() private carousel: SlickComponent) {
  }

  ngAfterViewInit() {
    this.carousel.addSlide(this);
  }

  ngOnDestroy() {
    this.carousel.removeSlide(this);
  }
}
