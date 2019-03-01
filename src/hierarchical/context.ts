import { UpdateTheme } from './models';

export interface IThemeContext {
  theme: {};
  update: UpdateTheme<{}>;
}

export const ThemeContext = React.createContext<IThemeContext>({ theme: undefined, update: () => void 0 });
