import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PoThemeA11yEnum, PoThemeService, PoThemeTypeEnum } from '@po-ui/ng-components';
import { piacentiniTheme } from './core/theme/piacentini-theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {
  private readonly theme = inject(PoThemeService);

  constructor() {
    this.theme.setTheme(piacentiniTheme, PoThemeTypeEnum.light, PoThemeA11yEnum.AAA);
  }
}
