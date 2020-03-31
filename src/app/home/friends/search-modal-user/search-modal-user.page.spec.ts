import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchModalUserPage } from './search-modal-user.page';

describe('SearchModalUserPage', () => {
  let component: SearchModalUserPage;
  let fixture: ComponentFixture<SearchModalUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchModalUserPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchModalUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
