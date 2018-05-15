// import { TestBed, async } from '@angular/core/testing';
// import { AppComponent } from './app.component';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { WebpackTranslateLoader } from './webpack-translate-loader';
// import { TabsModule } from 'ngx-bootstrap/tabs';

// describe('AppComponent', () => {
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         AppComponent
//       ],
//       imports: [
//         TranslateModule.forRoot({
//           loader: {
//             provide: TranslateLoader,
//             useClass: WebpackTranslateLoader
//           }
//         }),
//         TabsModule.forRoot()
//       ],
//     }).compileComponents();
//   }));
//   it('should create the app', async(() => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.debugElement.componentInstance;
//     expect(app).toBeTruthy();
//   }));
//   it(`should have as title 'app'`, async(() => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.debugElement.componentInstance;
//     expect(app.title).toEqual('app');
//   }));
//   it('should render title in a h1 tag', async(() => {
//     const fixture = TestBed.createComponent(AppComponent);
//     fixture.detectChanges();
//     const compiled = fixture.debugElement.nativeElement;
//     expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
//   }));
// });
