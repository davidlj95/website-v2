import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '../common/injection-tokens';

// Ensure in SCSS styles that these values alter the color scheme
// Partially enforced by color scheme tests in color-scheme.spec.ts
export enum Scheme {
  Light = 'light',
  Dark = 'dark',
}

@Injectable({
  providedIn: 'root'
})
export class ColorSchemeService {
  // Ensure in SCSS styles that this attribute in <html> changes color schemes accordingly
  // Partially enforced by color scheme tests in color-scheme.spec.ts
  public htmlAttribute = 'data-color-scheme';

  private documentElement: HTMLElement;

  constructor(
    @Inject(DOCUMENT) document: Document,
    @Inject(WINDOW) private window: Window,
  ) {
    this.documentElement = document.documentElement;
    this.listenForMatchMediaPreferenceChanges();
  }

  private get userPrefersDark(): boolean {
    return !!this.matchMediaQuery && this.matchMediaQuery.matches;
  }

  private get matchMediaQuery() {
    if (!this.window.matchMedia) {
      return null;
    }
    return this.window.matchMedia('(prefers-color-scheme: dark)');
  }

  toggleDarkLight() {
    const manuallySetScheme = this.documentElement.getAttribute(this.htmlAttribute);
    if (!manuallySetScheme) {
      this.setManual(this.userPrefersDark ? Scheme.Light : Scheme.Dark);
      return;
    }

    this.setManual(manuallySetScheme == Scheme.Light ? Scheme.Dark : Scheme.Light)
  }

  setManual(scheme: Scheme) {
    this.documentElement.setAttribute(this.htmlAttribute, scheme)
  }

  setSystem() {
    this.documentElement.removeAttribute(this.htmlAttribute);
  }

  private listenForMatchMediaPreferenceChanges() {
    this.matchMediaQuery?.addEventListener('change', () => {
      this.setSystem()
    })
  }
}
