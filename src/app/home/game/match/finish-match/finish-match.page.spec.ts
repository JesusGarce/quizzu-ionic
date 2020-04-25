import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FinishMatchPage } from './finish-match.page';

describe('FinishMatchPage', () => {
  let component: FinishMatchPage;
  let fixture: ComponentFixture<FinishMatchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishMatchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FinishMatchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
