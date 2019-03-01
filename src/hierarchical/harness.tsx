import { useReducer, FunctionComponent, useState } from 'react';
import { createHierarchicalTheme } from './createTheme';
import { UpdateTheme } from './models';
import { harness } from 'anux-package';
import { useBound } from 'anux-react-utils';
import './harness.scss';
import { IMap } from 'anux-common';

interface ITheme {
  title: {
    foregroundColor: string;
    backgroundColor: string;
  };
  button: {
    foregroundColor: string;
    backgroundColor: string;
  };
}

const AppTheme = createHierarchicalTheme<ITheme>(use => ({
  title: {
    foregroundColor: '#000',
    backgroundColor: '#FFF',
  },
  button: {
    foregroundColor: use(theme => theme.title.foregroundColor),
    backgroundColor: use(theme => theme.title.backgroundColor),
  },
}));

const renderCounts: IMap<number> = {};

const RenderCount: FunctionComponent = () => {
  const [id] = useState(Math.uniqueId());
  const count = renderCounts[id] = (renderCounts[id] || 0) + 1;

  return (
    <div className="render-count">
      <div className="render-count-number">
        {count}
      </div>
    </div>
  );
};

const Consumer: FunctionComponent = () => (
  <AppTheme.Consumer>
    {({ button: { backgroundColor } }) => (
      <div className="within-consumer" style={{ '--background-color': backgroundColor } as React.CSSProperties}>
        <RenderCount />
        <div>{backgroundColor}</div>
      </div>
    )}
  </AppTheme.Consumer>
);

const Updater: FunctionComponent<{ toggleBackgroundColor(update: UpdateTheme<ITheme>): void; }> = ({ toggleBackgroundColor }) => {
  const onClick = useBound((updateTheme: UpdateTheme<ITheme>) => () => toggleBackgroundColor(updateTheme));
  const updater = useBound((updateTheme: UpdateTheme<ITheme>) => (
    <div className="within-updater">
      <RenderCount />
      <div><button onClick={onClick(updateTheme)}>Toggle</button></div>
    </div>
  ));

  return (
    <AppTheme.Updater>
      {updater}
    </AppTheme.Updater>
  );
};

export default harness({ name: 'Main' })(() => {
  const [value, toggle] = useReducer(x => 1 - x, 0);

  const toggleBackgroundColor = useBound((updateTheme: UpdateTheme<ITheme>) => {
    updateTheme({
      title: {
        backgroundColor: value === 0 ? '#AAA' : '#FFF',
      },
    });
    toggle(value);
  });

  return (
    <div className="app">
      <AppTheme.Provider>
        <div className="within-provider">
          <RenderCount />
          <Updater toggleBackgroundColor={toggleBackgroundColor} />
          <Consumer />
        </div>
      </AppTheme.Provider>
    </div>
  );
});
