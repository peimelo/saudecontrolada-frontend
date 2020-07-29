import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

// <mat-icon mat-list-icon>{{ icon }}</mat-icon>
@Component({
  selector: 'app-nav-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a mat-list-item [routerLink]="routerLink" (click)="navigate.emit()">
      <mat-icon mat-list-icon>{{ icon }}</mat-icon>
      <span mat-line><ng-content></ng-content></span>
      <span mat-line class="secondary">{{ hint }}</span>
    </a>
  `,
  styles: [
    `
      /* ngrx */
      .secondary {
        color: rgba(0, 0, 0, 0.54);
      }
    `,
  ],
})
export class NavItemComponent {
  @Input() hint = '';
  @Input() icon = '';
  @Input() routerLink: string | any[] = '/';
  @Output() navigate = new EventEmitter();
}
