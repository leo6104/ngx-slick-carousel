import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {SlickCarouselComponent, SlickItemDirective} from '../slick.component';
import {SlickExampleComponent} from './slick-example.component';

describe('SlickExampleComponent', () => {
    let fixture: ComponentFixture<SlickExampleComponent>, component: SlickExampleComponent;
    beforeEach(() => {
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

        global['jQuery'] = () => ({
            slick: () => {
            },
            on: (event) => {
            }
        });
    });

    it('should be initialized', () => {
        const slickInitSpy = spyOn(component.slickModal, 'initSlick').and.callThrough();

        fixture.detectChanges();

        expect(slickInitSpy.calls.count()).toBe(1);
        expect(component.slickModal.initialized).toBeTruthy();
    });

    it('should call addSlide when add ngxSlickItem dynamically', () => {
        fixture.detectChanges();

        const slickAddSlideSpy = spyOn(component.slickModal, 'addSlide').and.callThrough();
        component.addSlide();

        fixture.detectChanges();

        expect(slickAddSlideSpy.calls.count()).toBe(1);
    });

    it('should call addSlide/removeSlide when slides reassigned', () => {
        const initSlidesLength = component.slides.length;

        fixture.detectChanges();

        const slickAddSlideSpy = spyOn(component.slickModal, 'addSlide').and.callThrough();
        const slickRemoveSlideSpy = spyOn(component.slickModal, 'removeSlide').and.callThrough();

        component.slides = [{img: 'http://placehold.it/350x150/00000'}];

        fixture.detectChanges();

        expect(slickRemoveSlideSpy.calls.count()).toBeGreaterThanOrEqual(initSlidesLength);
        expect(slickAddSlideSpy.calls.count()).toBe(1);

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
