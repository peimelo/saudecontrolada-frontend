import { formatNumber } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { User } from '../../../auth/models';
import { FormErrorService } from '../../../core/services/form-error.service';
import { Height } from '../../../shared/models';

@Component({
  selector: 'app-height-form-dialog',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './height-form-dialog.component.html',
})
export class HeightFormDialogComponent implements OnChanges {
  form = this.fb.group({
    date: ['', Validators.required],
    value: ['', [Validators.min(20), Validators.max(250), Validators.required]],
  });
  isNotFilledHeight = true;
  isEditing = false;
  originalHeight!: Height;

  @Input() error!: Observable<any>;
  @Input() isLoading!: boolean;
  @Input() user!: User;
  @Input() height!: Height;

  @Output() private create = new EventEmitter<Height>();
  @Output() private update = new EventEmitter<Height>();

  constructor(
    private fb: FormBuilder,
    private formErrorService: FormErrorService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.height && this.height.id) {
      this.isEditing = true;

      if (changes.height && changes.height.firstChange) {
        this.originalHeight = changes.height.currentValue;
      }

      this.form.patchValue({
        date: moment.utc(this.height.date),
        value: formatNumber(this.height.value, 'pt', '0.2-2'),
      });
    } else {
      if (this.isNotFilledHeight) {
        this.form.patchValue({
          date: moment(),
        });

        this.isNotFilledHeight = false;
      }
    }
  }

  getErrorDate(pickerInput: string): string {
    if (!pickerInput || pickerInput === '') {
      return 'Please choose a date.';
    }

    return this.formErrorService.isMyDateFormat(pickerInput);
  }

  getErrorValue(): string {
    return this.form.get('value')?.hasError('required')
      ? 'Field is required.'
      : this.form.get('value')?.hasError('min')
      ? 'Must be >= 20'
      : this.form.get('value')?.hasError('max')
      ? 'Must be <= 250'
      : '';
  }

  onCreate(form: FormGroup): void {
    const { valid, value } = form;
    console.log(value.date);

    if (valid) {
      const height = {
        ...this.height,
        date: moment(value.date).format('YYYY-MM-DD'),
        value: value.value,
      };

      this.create.emit(height);
    }
  }

  onUpdate(form: FormGroup): void {
    const { valid, value } = form;

    if (valid) {
      const height = {
        ...this.height,
        date: moment(value.date).format('YYYY-MM-DD'),
        value: this.convertToFloat(this.originalHeight.value, value.value),
      };

      this.update.emit(height);
    }
  }

  private convertToFloat(oldValue: any, newValue: any): number {
    return parseFloat(oldValue) ===
      parseFloat(newValue.replace('.', '').replace(',', '.'))
      ? oldValue
      : newValue;
  }
}
