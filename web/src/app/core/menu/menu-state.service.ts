import { Injectable, signal } from '@angular/core';

const COLLAPSED_KEY = 'piacentini_menu_collapsed';

@Injectable({ providedIn: 'root' })
export class MenuStateService {
  private _collapsed = signal<boolean>(
    localStorage.getItem(COLLAPSED_KEY) === 'true'
  );

  readonly collapsed = this._collapsed.asReadonly();

  toggle(): void {
    this.setCollapsed(!this._collapsed());
  }

  setCollapsed(value: boolean): void {
    this._collapsed.set(value);
    localStorage.setItem(COLLAPSED_KEY, String(value));
  }
}
