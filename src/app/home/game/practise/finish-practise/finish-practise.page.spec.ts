import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FinishPractisePage } from './finish-practise.page';

describe('FinishPractisePage', () => {
  let component: FinishPractisePage;
  let fixture: ComponentFixture<FinishPractisePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishPractisePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FinishPractisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
