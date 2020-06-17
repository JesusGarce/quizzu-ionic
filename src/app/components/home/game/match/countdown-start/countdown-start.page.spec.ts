import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CountdownStartPage } from './countdown-start.page';

describe('CountdownStartPage', () => {
  let component: CountdownStartPage;
  let fixture: ComponentFixture<CountdownStartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountdownStartPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CountdownStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
