import { TestBed } from '@angular/core/testing';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import * as fromAuth from '../reducers';
import { AuthFacadeService } from '../services/auth-facade.service';
import { AuthGuard } from './auth.guard';

describe('Auth Guard', () => {
  let guard: AuthGuard;
  let store: MockStore;
  let loggedIn: MemoizedSelector<fromAuth.State, boolean>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, AuthFacadeService, provideMockStore()],
    });

    store = TestBed.inject(MockStore);
    guard = TestBed.inject(AuthGuard);

    loggedIn = store.overrideSelector(fromAuth.selectLoggedIn, false);
  });

  // it('should return false if the user state is not logged in', () => {
  //   const expected = cold('(a|)', { a: false });

  //   expect(guard.canActivate()).toBeObservable(expected);
  // });

  it('should return true if the user state is logged in', () => {
    const expected = cold('(a|)', { a: true });

    loggedIn.setResult(true);

    expect(guard.canActivate()).toBeObservable(expected);
  });
});
