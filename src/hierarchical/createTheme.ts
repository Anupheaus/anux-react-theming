import { Use } from './models';
import { createProvider } from './provider';
import { createConsumer } from './consumer';
import { createUpdater } from './updater';

export function createHierarchicalTheme<TTheme>(delegate: (use: Use<TTheme>) => TTheme) {
  return {
    Provider: createProvider<TTheme>(delegate),
    Consumer: createConsumer<TTheme>(),
    Updater: createUpdater<TTheme>(),
  };
}
