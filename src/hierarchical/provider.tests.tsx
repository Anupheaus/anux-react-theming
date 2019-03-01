import { mount } from 'enzyme';
import { createHierarchicalTheme } from './createTheme';
import { UpdateTheme } from './models';

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

it('provides a theme correctly', () => {
  let theme: ITheme;

  const component = mount((
    <AppTheme.Provider>
      <AppTheme.Consumer>
        {providedTheme => { theme = providedTheme; return null; }}
      </AppTheme.Consumer>
    </AppTheme.Provider>
  ));

  expect(theme).to.be.eql({
    title: {
      foregroundColor: '#000',
      backgroundColor: '#FFF',
    },
    button: {
      foregroundColor: '#000',
      backgroundColor: '#FFF',
    },
  });

  component.unmount();

});

it('provides a theme correctly in a hierarchy and updates do not interfere with providers', () => {
  let topTheme: ITheme;
  let bottomTheme: ITheme;
  let topUpdate: UpdateTheme<ITheme>;
  let bottomUpdate: UpdateTheme<ITheme>;

  const component = mount((
    <AppTheme.Provider>
      <AppTheme.Consumer>
        {topProvidedTheme => {
          topTheme = topProvidedTheme; return (
            <AppTheme.Provider>
              <AppTheme.Consumer>
                {bottomProvidedTheme => { bottomTheme = bottomProvidedTheme; return null; }}
              </AppTheme.Consumer>
              <AppTheme.Updater>
                {bottomProvidedUpdate => { bottomUpdate = bottomProvidedUpdate; return null; }}
              </AppTheme.Updater>
            </AppTheme.Provider>
          );
        }}
      </AppTheme.Consumer>
      <AppTheme.Updater>
        {topProvidedUpdate => { topUpdate = topProvidedUpdate; return null; }}
      </AppTheme.Updater>
    </AppTheme.Provider>
  ));

  const defaultExpectation = { title: { foregroundColor: '#000', backgroundColor: '#FFF' }, button: { foregroundColor: '#000', backgroundColor: '#FFF' } };

  expect(topTheme).to.eql(defaultExpectation);
  expect(bottomTheme).to.eql(defaultExpectation);

  bottomUpdate({ button: { foregroundColor: '#AAA' } });

  expect(topTheme).to.eql(defaultExpectation);
  expect(bottomTheme).to.eql({ ...defaultExpectation, button: { ...defaultExpectation.button, foregroundColor: '#AAA' } });

  topUpdate({ button: { foregroundColor: '#BBB' } });

  expect(topTheme).to.eql({ ...defaultExpectation, button: { ...defaultExpectation.button, foregroundColor: '#BBB' } });
  expect(bottomTheme).to.eql({ ...defaultExpectation, button: { ...defaultExpectation.button, foregroundColor: '#AAA' } });

  component.unmount();

});
