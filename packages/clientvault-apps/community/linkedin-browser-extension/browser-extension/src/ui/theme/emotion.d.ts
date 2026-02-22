import type { ThemeType } from 'clientvault-ui/theme';

declare module '@emotion/react' {
  export interface Theme extends ThemeType {}
}
