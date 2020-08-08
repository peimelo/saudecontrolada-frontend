import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  AuthActions,
  ForgotPasswordPageActions,
  LoginPageActions,
  ResetPasswordPageActions,
} from '../actions';
import { Credentials, PasswordCombination } from '../models';
import * as fromAuth from '../reducers';

@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  loggedIn$: Observable<boolean>;
  user$: Observable<any>;

  constructor(private store: Store<fromAuth.State>) {
    this.loggedIn$ = this.store.pipe(select(fromAuth.selectLoggedIn));

    this.user$ = this.store.pipe(select(fromAuth.selectUser));
  }

  login(credentials: Credentials): void {
    this.store.dispatch(LoginPageActions.login({ credentials }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  forgotPassword(email: string): void {
    this.store.dispatch(ForgotPasswordPageActions.forgotPassword({ email }));
  }

  resetPassword(passwordCombination: PasswordCombination): void {
    this.store.dispatch(
      ResetPasswordPageActions.resetPassword({ passwordCombination })
    );
  }
}
