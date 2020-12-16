import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import { Pagination, Weight } from '../../../shared/models';
import { PaginationService } from '../../../shared/services/pagination.service';
import { DialogConfig } from '../../models';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';

@Component({
  selector: 'app-weights',
  templateUrl: './weights.component.html',
  styleUrls: ['./weights.component.scss'],
})
export class WeightsComponent {
  columnDefinitions = [
    { columnDef: 'id', showMobile: false },
    { columnDef: 'date', showMobile: true },
    { columnDef: 'value', showMobile: true },
    { columnDef: 'range', showMobile: false },
    { columnDef: 'actions', showMobile: true },
  ];

  @Input() isHandset: boolean;
  @Input() pagination: Pagination;
  @Input() weights: Weight[];

  @Output() private changePage = new EventEmitter<PageEvent>();
  @Output() private add = new EventEmitter();
  @Output() private delete = new EventEmitter<number>();
  @Output() private edit = new EventEmitter<Weight>();

  constructor(
    private confirmationDialogService: ConfirmationDialogService,
    private paginationService: PaginationService
  ) {}

  deleteConfirmDialog(weight: Weight): void {
    const dialogConfig: DialogConfig = {
      confirmText: 'Remove',
      content: `'${moment
        .utc(weight.date)
        .format('DD/MM/YYYY HH:mm')}' will be removed.`,
      title: 'Remove weight',
    };
    this.confirmationDialogService.show(this.delete, weight.id, dialogConfig);
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((item) => (this.isHandset ? item.showMobile : true))
      .map((item) => item.columnDef);
  }

  onAdd(): void {
    this.add.emit();
  }

  onChangePage(event: PageEvent): void {
    this.changePage.emit(event);
  }

  onEdit(weight: Weight): void {
    this.edit.emit(weight);
  }

  get initialRange(): number {
    return this.paginationService.initialRange(this.pagination);
  }

  get finalRange(): number {
    return this.paginationService.finalRange(this.pagination);
  }
}
