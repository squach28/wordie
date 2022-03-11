import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinGameDialogComponent } from './win-game-dialog.component';

describe('WinGameDialogComponent', () => {
  let component: WinGameDialogComponent;
  let fixture: ComponentFixture<WinGameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WinGameDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WinGameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
