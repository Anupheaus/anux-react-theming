import { Use, UpdateTheme } from './models';
import { FunctionComponent, useState } from 'react';
import { ThemeContext, IThemeContext } from './context';
import { generateTheme } from './generateTheme';
import { useBound, areShallowEqual } from 'anux-react-utils';

interface IRendererProps<TTheme> {
  theme: TTheme;
}

export function createProvider<TTheme>(delegate: (use: Use<TTheme>) => TTheme) {
  let lastChildren: React.ReactNode;

  const Renderer: FunctionComponent<IRendererProps<TTheme>> = ({ theme: defaultTheme, children }) => {
    defaultTheme = defaultTheme ? Object.clone(defaultTheme) : generateTheme({}, delegate) as TTheme;
    const [theme, setTheme] = useState(defaultTheme);

    const update = useBound<UpdateTheme<TTheme>>(themeOrUpdate => setTheme(generateTheme(theme, themeOrUpdate)));

    // not sure why we need this but it prevents re-renders within the context provider.
    if (areShallowEqual(lastChildren, children)) { children = lastChildren; }
    lastChildren = children;

    return (
      <ThemeContext.Provider value={{ theme, update }}>
        {children || null}
      </ThemeContext.Provider>
    );
  };

  const Provider: FunctionComponent = ({ children }) => {

    const renderChildren = useBound<(value: IThemeContext) => React.ReactNode>(({ theme }) => (
      <Renderer theme={theme as TTheme}>
        {children}
      </Renderer>
    ));

    return (
      <ThemeContext.Consumer>
        {renderChildren}
      </ThemeContext.Consumer>

    );
  };

  return Provider;
}
