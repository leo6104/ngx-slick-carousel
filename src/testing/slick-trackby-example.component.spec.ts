import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { SlickCarouselComponent, SlickItemDirective } from '../slick.component';
import { SlickTrackbyExampleComponent } from './slick-trackby-example.component';

describe('SlickTrackbyExampleComponent', () => {
  let fixture: ComponentFixture<SlickTrackbyExampleComponent>, component: SlickTrackbyExampleComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule
      ],
      declarations: [
        SlickCarouselComponent,
        SlickItemDirective,
        SlickTrackbyExampleComponent
      ]
    });
    fixture = TestBed.createComponent(SlickTrackbyExampleComponent);
    component = fixture.componentInstance;
  });

  it('should be initialized', () => {
    const slickInitSpy = spyOn(component.slickModal, 'initSlick').and.callThrough();

    fixture.detectChanges();

    expect(slickInitSpy).toHaveBeenCalled();
    expect(component.slickModal.initialized).toBeTruthy();
  });

  it('should call addSlide when add ngxSlickItem dynamically', () => {
    fixture.detectChanges();

    const slickAddSlideSpy = spyOn(component.slickModal, 'addSlide').and.callThrough();
    component.addSlide();

    fixture.detectChanges();

    expect(slickAddSlideSpy.calls.count()).toBe(1);
  });

  it('should not call addSlide/removeSlide when trackBy function works', () => {
    const tempSlide = { img: 'http://placehold.it/350x150/00000' };
    component.slides.push(tempSlide);

    const initSlideLength = component.slides.length;

    fixture.detectChanges();

    const slickAddSlideSpy = spyOn(component.slickModal, 'addSlide').and.callThrough();
    const slickRemoveSlideSpy = spyOn(component.slickModal, 'removeSlide').and.callThrough();

    component.slides = [tempSlide];

    fixture.detectChanges();

    expect(slickAddSlideSpy.calls.count()).toBe(0);
    expect(slickRemoveSlideSpy.calls.count()).toBeGreaterThanOrEqual(initSlideLength - 1);

    expect(component.slickModal.slides.length).toBe(1);
  });

  it('should be unslick status when slides is empty', () => {
    fixture.detectChanges();

    const unslickSpy = spyOn(component.slickModal, 'unslick').and.callThrough();
    component.slides = [];

    fixture.detectChanges();

    expect(unslickSpy.calls.count()).toBe(1);
    expect(component.slickModal.initialized).toBeFalsy();
  });
});
