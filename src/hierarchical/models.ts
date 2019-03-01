import { DeepPartial } from 'anux-common';

export type Use<TTheme> = <TValue>(delegate: (theme: TTheme) => TValue) => TValue;

// tslint:disable-next-line: interface-name
export interface UpdateTheme<TTheme> {
  (theme: DeepPartial<TTheme>): void;
  (update: (use: Use<TTheme>) => DeepPartial<TTheme>): void;
}
