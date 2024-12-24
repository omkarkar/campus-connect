declare module 'mobx-react-lite' {
  import * as React from 'react';
  import { ObservableMap, IReactionDisposer } from 'mobx';

  export function observer<P = {}>(baseComponent: React.ComponentType<P>): React.ComponentType<P>;
  export function observer<P = {}>(baseComponent: React.FC<P>): React.FC<P>;

  export function useObserver<T>(fn: () => T, baseComponentName?: string): T;

  export function observerBatching(reactionScheduler?: (batch: () => void) => void): void;
}
