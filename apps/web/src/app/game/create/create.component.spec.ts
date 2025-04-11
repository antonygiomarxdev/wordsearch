import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGameComponent } from './create.component';

describe('CreateComponent', () => {
  let component: CreateGameComponent;
  let fixture: ComponentFixture<CreateGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
