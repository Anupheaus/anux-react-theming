import { FunctionComponent } from 'react';
import { ThemeContext } from './context';

export interface IConsumerProps<TTheme> {
  children(theme: TTheme): React.ReactNode;
}

export function createConsumer<TTheme>() {

  const Consumer: FunctionComponent<IConsumerProps<TTheme>> = ({ children }) => ((
    <ThemeContext.Consumer>
      {({ theme }) => children(theme as TTheme)}
    </ThemeContext.Consumer>
  ));

  return Consumer;
}
