const memoCache = new Map();

export default function easyMemo(memoFn: (...args: any[]) => unknown, deps: any[]) {
  // tslint:disable-next-line:no-shadowed-variable
  return (...args: any[]) => {
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

export function clearCache() {
  memoCache.clear();
}

const cacheKeyFor = (memoFn: (...args: any[]) => unknown, deps: any[], ...args: any[]): string => {
  return `${memoFn.toString()}-${deps.toString()}-${args.toString()}`;
};
