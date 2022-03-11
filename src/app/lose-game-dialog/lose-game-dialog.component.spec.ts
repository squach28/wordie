import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoseGameDialogComponent } from './lose-game-dialog.component';

describe('LoseGameDialogComponent', () => {
  let component: LoseGameDialogComponent;
  let fixture: ComponentFixture<LoseGameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoseGameDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoseGameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
