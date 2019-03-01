import { DeepPartial } from 'anux-common';
import { Use } from './models';

const originalUseFunc = Symbol('OriginalUseFunc');

export function generateTheme<TTheme>(theme: TTheme, update: DeepPartial<TTheme>): TTheme;
export function generateTheme<TTheme>(theme: TTheme, delegate: (use: Use<TTheme>) => DeepPartial<TTheme>): TTheme;
export function generateTheme<TTheme>(theme: TTheme, updateOrDelegate: DeepPartial<TTheme> | ((use: Use<TTheme>) => DeepPartial<TTheme>)): TTheme {

  function use<TValue>(useDelegate: (theme: TTheme) => TValue): TValue {
    return useDelegate as any;
  }

  const defineProperty = (target: Object, key: PropertyKey, useFunc: (theme: TTheme) => any) => {
    const get = () => { try { return useFunc(theme); } catch (error) { return undefined; } };
    get[originalUseFunc] = useFunc;
    Object.defineProperty(target, key, {
      get,
      enumerable: true,
      configurable: true,
    });
  };

  const replaceUses = (target: Object): Object => {
    Reflect.ownKeys(target)
      .forEach(key => {
        const propertyDescriptor = Reflect.getDefinition(target, key);
        if (propertyDescriptor.get) {
          const originalFunc = propertyDescriptor.get[originalUseFunc];
          defineProperty(target, key, originalFunc);
        } else {
          const value = target[key];
          if (typeof (value) === 'function') {
            defineProperty(target, key, value);
          } else if (typeof (value) === 'object' && value != null) {
            target[key] = replaceUses(value);
          }
        }
      });
    return target;
  };

  const updatedTheme = typeof (updateOrDelegate) === 'function' ? updateOrDelegate(use) : updateOrDelegate;

  theme = replaceUses(Object.merge({}, theme, updatedTheme)) as TTheme;

  return theme;
}
