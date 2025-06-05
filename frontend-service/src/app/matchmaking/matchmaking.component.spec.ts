import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchmakingComponent } from './matchmaking.component';

describe('MatchmakingComponent', () => {
  let component: MatchmakingComponent;
  let fixture: ComponentFixture<MatchmakingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchmakingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchmakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
