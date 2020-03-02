import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { SlickCarouselComponent, SlickItemDirective } from '../slick.component';
import { SlickExampleComponent } from './slick-example.component';
import { By } from '@angular/platform-browser';

describe('SlickExampleComponent', () => {
  let fixture: ComponentFixture<SlickExampleComponent>,
    component: SlickExampleComponent,
    slick: SlickCarouselComponent;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule
      ],
      declarations: [
        SlickCarouselComponent,
        SlickItemDirective,
        SlickExampleComponent
      ]
    });
    fixture = TestBed.createComponent(SlickExampleComponent);
    component = fixture.componentInstance;
    slick = fixture.debugElement.query(By.directive(SlickCarouselComponent)).componentInstance;
  });

  it('should be initialized', () => {
    const slickInitSpy = spyOn(slick, 'initSlick').and.callThrough();

    fixture.detectChanges();

    expect(slickInitSpy).toHaveBeenCalled();
    expect(slick.initialized).toBeTruthy();
  });

  it('should call addSlide when add ngxSlickItem dynamically', () => {
    fixture.detectChanges();

    const slickAddSlideSpy = spyOn(slick, 'addSlide').and.callThrough();
    component.addSlide();

    fixture.detectChanges();

    expect(slickAddSlideSpy.calls.count()).toBe(1);
  });

  it('should call addSlide/removeSlide when slides reassigned', () => {
    const initSlidesLength = component.slides.length;

    fixture.detectChanges();

    const slickAddSlideSpy = spyOn(slick, 'addSlide').and.callThrough();
    const slickRemoveSlideSpy = spyOn(slick, 'removeSlide').and.callThrough();

    component.slides = [{ img: 'http://placehold.it/350x150/00000' }];

    fixture.detectChanges();

    expect(slickRemoveSlideSpy.calls.count()).toBeGreaterThanOrEqual(initSlidesLength);
    expect(slickAddSlideSpy.calls.count()).toBe(1);

    expect(slick.slides.length).toBe(1);
  });

  it('should be unslick status when slides is empty', () => {
    fixture.detectChanges();

    const unslickSpy = spyOn(slick, 'unslick').and.callThrough();
    component.slides = [];

    fixture.detectChanges();

    expect(unslickSpy.calls.count()).toBe(1);
    expect(slick.initialized).toBeFalsy();
  });
});
