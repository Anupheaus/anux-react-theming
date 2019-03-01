import { FunctionComponent, useContext, useMemo } from 'react';
import { ThemeContext } from './context';
import { UpdateTheme } from './models';
import { is } from 'anux-common';

export interface IUpdaterProps<TTheme> {
  update?: UpdateTheme<TTheme>;
  children: React.ReactNode | ((updateTheme: UpdateTheme<TTheme>) => React.ReactNode);
}

export interface IThemeUpdaterProps<TTheme> {
  update?: UpdateTheme<TTheme>;
  children: React.ReactNode | ((updateTheme: UpdateTheme<TTheme>) => React.ReactNode);
}

export function createUpdater<TTheme>() {

  const Updater: FunctionComponent<IUpdaterProps<TTheme>> = ({ update, children }) => {
    const { update: updateFunc } = useContext(ThemeContext);

    if (update) { updateFunc(update); }

    return useMemo(() => (
      <>
        {is.function(children) ? children(updateFunc) : children}
      </>
    ), [children, updateFunc]);
  };

  return Updater;
}
