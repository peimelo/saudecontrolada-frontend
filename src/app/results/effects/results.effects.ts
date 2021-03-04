import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  exhaustMap,
  map,
  mergeMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { MessageApiActions } from '../../core/actions';
import { ErrorsService } from '../../shared/services/errors.service';
import {
  ResultsActions,
  ResultsApiActions,
  ResultsFormDialogActions,
  ResultsPageActions,
} from '../actions';
import { ResultFormDialogPageComponent } from '../containers/result-form-dialog-page/result-form-dialog-page.component';
import { ResultsFacadeService } from '../services/results-facade.service';
import { ResultsService } from '../services/results.service';

@Injectable()
export class ResultsEffects {
  dialogRef: any;

  addResult$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ResultsPageActions.addResult),
        tap(() => {
          this.dialogRef = this.dialog.open(ResultFormDialogPageComponent, {
            data: {},
          });
        })
      ),
    { dispatch: false }
  );

  createResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResultsFormDialogActions.createResult),
      mergeMap(({ result }) =>
        this.resultsService.create(result).pipe(
          mergeMap((response) => [
            ResultsApiActions.createResultSuccess(),
            ResultsActions.resultFormDialogDismiss(),
            MessageApiActions.successMessage({
              message: 'Record successfully created.',
            }),
          ]),
          catchError((error) => this.errorService.showError(error))
        )
      )
    )
  );

  deleteResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResultsPageActions.deleteResult),
      mergeMap(({ id }) =>
        this.resultsService.delete(id).pipe(
          mergeMap(() => [
            ResultsApiActions.deleteResultSuccess(),
            MessageApiActions.successMessage({
              message: 'Record successfully deleted.',
            }),
          ]),
          catchError((error) => this.errorService.showError(error))
        )
      )
    )
  );

  editResult$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ResultsPageActions.editResult),
        tap(({ result }) => {
          this.dialogRef = this.dialog.open(ResultFormDialogPageComponent, {
            data: { result },
          });
        })
      ),
    { dispatch: false }
  );

  loadResults$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ResultsPageActions.loadResults,
        ResultsPageActions.changePageResults,
        ResultsPageActions.sortResults,
        ResultsApiActions.createResultSuccess,
        ResultsApiActions.deleteResultSuccess,
        ResultsApiActions.updateResultSuccess
      ),
      withLatestFrom(
        this.resultsFacadeService.pagination$,
        this.resultsFacadeService.sort$
      ),
      exhaustMap(([action, pagination, sort]) =>
        this.resultsService.getAll(pagination.currentPage, sort).pipe(
          map((resultResponse) =>
            ResultsApiActions.loadResultsSuccess({ resultResponse })
          ),
          catchError((error) => this.errorService.showError(error))
        )
      )
    )
  );

  updateResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResultsFormDialogActions.updateResult),
      mergeMap(({ result }) =>
        this.resultsService.update(result).pipe(
          mergeMap((resultResponse) => [
            ResultsApiActions.updateResultSuccess(),
            ResultsActions.resultFormDialogDismiss(),
            MessageApiActions.successMessage({
              message: 'Record successfully updated.',
            }),
          ]),
          catchError((error) => this.errorService.showError(error))
        )
      )
    )
  );

  resultFormDialogDismiss$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ResultsActions.resultFormDialogDismiss),
        tap(() => {
          this.dialogRef.close();
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private dialog: MatDialog,
    private errorService: ErrorsService,
    private resultsFacadeService: ResultsFacadeService,
    private resultsService: ResultsService
  ) {}
}
