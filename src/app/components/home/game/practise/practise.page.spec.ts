import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PractisePage } from './practise.page';

describe('PractisePage', () => {
  let component: PractisePage;
  let fixture: ComponentFixture<PractisePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PractisePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PractisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
