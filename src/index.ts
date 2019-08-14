const memoCache = new Map();

export default function easyMemo<T = unknown>(memoFn: (...args: any[]) => T, deps: any[]) {
  // tslint:disable-next-line:no-shadowed-variable
  return (...args: any[]): T => {
    if (memoCache.has(cacheKeyFor(memoFn, deps, args))) {
      return memoCache.get(cacheKeyFor(memoFn, deps, args));
    } else {
      // Calculate result of input function
      const result = memoFn.apply(undefined, args);
      memoCache.set(cacheKeyFor(memoFn, deps, args), result);

      return result;
    }
  };
}

export function clear() {
  memoCache.clear();
}

const cacheKeyFor = (memoFn: (...args: any[]) => unknown, deps: any[], ...args: any[]): string => {
  return `${memoFn.toString()}-${deps.toString()}-${args.toString()}`;
};
