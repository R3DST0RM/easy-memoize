const memoCache = new Map();

export default function easyMemo(memoFn: (...args: any[]) => unknown, ...args: any[]) {
  if (memoCache.has(calcKey(memoFn, args))) {
    return memoCache.get(calcKey(memoFn, args));
  } else {
    const result = memoFn.apply(undefined, args);
    memoCache.set(calcKey(memoFn, args), result);

    return result;
  }
}

export function clearCache() {
  memoCache.clear();
}

const calcKey = (memoFn: (...args: any[]) => unknown, ...args: any[]) => {
  return `${memoFn.toString()}-${args.toString()}`;
};
