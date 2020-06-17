import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchOpponentPage } from './search-opponent.page';

describe('SearchOpponentPage', () => {
  let component: SearchOpponentPage;
  let fixture: ComponentFixture<SearchOpponentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchOpponentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchOpponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
