const memoCache = new Map();

export default function easyMemo(memoFn: (...args: any[]) => unknown) {
  // tslint:disable-next-line:no-shadowed-variable
  return (...args: any[]) => {
    if (memoCache.has(cacheKeyFor(memoFn, args))) {
      return memoCache.get(cacheKeyFor(memoFn, args));
    } else {
      // Calculate result of input function
      const result = memoFn.apply(undefined, args);
      memoCache.set(cacheKeyFor(memoFn, args), result);

      return result;
    }
  };
}

export function clearCache() {
  memoCache.clear();
}

const cacheKeyFor = (memoFn: (...args: any[]) => unknown, ...args: any[]): string => {
  return `${memoFn.toString()}-${args.toString()}`;
};
