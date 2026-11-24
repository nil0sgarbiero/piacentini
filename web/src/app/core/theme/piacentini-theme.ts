import {
  PoTheme,
  PoThemeA11yEnum,
  poThemeDefaultActions,
  poThemeDefaultActionsDark,
  poThemeDefaultDarkValues,
  poThemeDefaultFeedback,
  poThemeDefaultFeedbackDark,
  poThemeDefaultLightValues,
  poThemeDefaultNeutrals,
  PoThemeTokens,
  PoThemeTypeEnum,
} from '@po-ui/ng-components';

/** Ajustes globais — fonte pequena (small) e família Roboto */
const onRoot = {
  '--font-family-theme': 'Roboto, "Helvetica Neue", Arial, sans-serif',
  '--font-size': 'var(--font-size-sm)',
  '--font-size-sm': '12px',
  '--font-size-md': '14px',
  '--font-size-lg': '16px',
  '--color-page-background-color-page': 'var(--color-neutral-light-05)',
};

/** Ajustes por componente — densidade compacta estilo TOTVS */
const perComponent = {
  'po-button': {
    '--font-size': 'var(--font-size-sm)',
    '--border-width': 0,
    '--outline-color-focused': 'transparent',
  },
  'po-button[p-kind="primary"]': {
    '--color': 'var(--color-brand-01-base)',
    '--color-hover': 'var(--color-brand-01-dark)',
    '--text-color': '#ffffff',
    '--shadow': 'var(--shadow-sm)',
  },
  'po-menu': {
    '--font-size': 'var(--font-size-sm)',
    '--background-color': 'var(--color-neutral-light-20)',
  },
  'po-toolbar': {
    '--font-size': 'var(--font-size-md)',
    '--background-color': 'var(--color-neutral-light-10)',
  },
  'po-table': {
    '--font-size': 'var(--font-size-sm)',
  },
  'po-page-default': {
    '--font-size': 'var(--font-size-sm)',
  },
  'po-card': {
    '--background-color': 'var(--color-neutral-light-05)',
    '--text-color': 'var(--color-neutral-dark-80)',
  },
  'po-card[p-variant="elevated"]': {
    '--background-color': 'var(--color-neutral-light-10)',
  },
};

/** Tema LIGHT — padrão Piacentini */
const piacentiniLight: PoThemeTokens = {
  color: {
    brand: {
      '01': {
        lightest: '#e6f2f9',
        lighter: '#b3d9ec',
        light: '#66b3d6',
        base: '#0069a8',
        dark: '#005a91',
        darker: '#004a78',
        darkest: '#003a5e',
      },
      '02': {
        base: '#1a4f8b',
      },
      '03': {
        base: '#ffd464',
      },
    },
    action: {
      ...poThemeDefaultActions,
      disabled: 'var(--color-neutral-mid-40)',
    },
    feedback: poThemeDefaultFeedback,
    neutral: {
      ...poThemeDefaultNeutrals,
    },
  },
  onRoot: {
    ...poThemeDefaultLightValues.onRoot,
    ...onRoot,
  },
  perComponent: {
    ...poThemeDefaultLightValues.perComponent,
    ...perComponent,
  },
};

/** Tema DARK — inversão da escala de marca */
const piacentiniDark: PoThemeTokens = {
  color: {
    brand: {
      '01': {
        darkest: '#e6f2f9',
        darker: '#b3d9ec',
        dark: '#66b3d6',
        base: '#0069a8',
        light: '#005a91',
        lighter: '#004a78',
        lightest: '#003a5e',
      },
      '02': {
        base: '#1a4f8b',
      },
      '03': {
        base: '#ffd464',
      },
    },
    action: {
      ...poThemeDefaultActionsDark,
      disabled: 'var(--color-neutral-mid-40)',
    },
    feedback: poThemeDefaultFeedbackDark,
    neutral: {
      light: {
        '00': '#1c1c1c',
        '05': '#202020',
        '10': '#2b2b2b',
        '20': '#3b3b3b',
        '30': '#5a5a5a',
      },
      mid: {
        '40': '#7c7c7c',
        '60': '#a1a1a1',
      },
      dark: {
        '70': '#c1c1c1',
        '80': '#d9d9d9',
        '90': '#eeeeee',
        '95': '#fbfbfb',
      },
    },
  },
  onRoot: {
    ...poThemeDefaultDarkValues.onRoot,
    ...onRoot,
  },
  perComponent: {
    ...poThemeDefaultDarkValues.perComponent,
    ...perComponent,
  },
};

export const piacentiniTheme: PoTheme = {
  name: 'piacentini',
  type: [
    {
      light: piacentiniLight,
      dark: piacentiniDark,
      a11y: PoThemeA11yEnum.AA,
    },
    {
      light: piacentiniLight,
      dark: piacentiniDark,
      a11y: PoThemeA11yEnum.AAA,
    },
  ],
  active: { type: PoThemeTypeEnum.light, a11y: PoThemeA11yEnum.AA },
};
