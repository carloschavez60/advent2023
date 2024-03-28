import 'lodash';

declare module 'lodash' {
  interface CollectionChain<T> {
    next(): {
      done: boolean;
      value: T;
    };
  }
}
