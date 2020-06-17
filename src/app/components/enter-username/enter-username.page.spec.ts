import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnterUsernamePage } from './enter-username.page';

describe('EnterUsernamePage', () => {
  let component: EnterUsernamePage;
  let fixture: ComponentFixture<EnterUsernamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterUsernamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnterUsernamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
