# ngx-slick-carousel

[Example](https://embed.plnkr.co/fblxzfPneL66950A4VDM/)

## Installation

To install this library, run:

```bash
$ npm install ngx-slick-carousel --save
```

## Consuming your library

Once you have published your library to npm, you can import your library in any Angular application by running:

```bash
$ npm install ngx-slick-carousel
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { SlickModule } from 'ngx-slick-carousel';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify your library as an import
    SlickModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

- Include jquery and slick css/js in your application :
```
<script src="//code.jquery.com/jquery-3.2.1.min.js"></script>
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick.css"/>
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick-theme.css"/>
<script src="https://unpkg.com/slick-carousel@1.6.0/slick/slick.js"></script>
```

Once your library is imported, you can use its components, directives and pipes in your Angular application:
```html
  <!-- You can now use your library component in app.component.html -->
    <ngx-slick class="carousel" #slickModal="slick-modal" [config]="slideConfig" (afterChange)="afterChange($event)">
        <div ngxSlickItem *ngFor="let slide of slides" class="slide">
              <img src="{{ slide.img }}" alt="" width="100%">
        </div>
    </ngx-slick>
    
    <button (click)="addSlide()">Add</button>
    <button (click)="removeSlide()">Remove</button>
    <button (click)="slickModal.slickGoTo(2)">slickGoto 2</button>
    <button (click)="slickModal.unslick()">unslick</button>
```

```javascript
  slides = [
    {img: "http://placehold.it/350x150/000000"},
    {img: "http://placehold.it/350x150/111111"},
    {img: "http://placehold.it/350x150/333333"},
    {img: "http://placehold.it/350x150/666666"}
  ];
  slideConfig = {"slidesToShow": 4, "slidesToScroll": 4};

  addSlide() {
    this.slides.push({img: "http://placehold.it/350x150/777777"})
  }

  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

  afterChange(e) {
    console.log('afterChange');
  }
```


## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [Heo](mailto:heo@mapiacompany.com)
