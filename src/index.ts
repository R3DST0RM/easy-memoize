import "core-js/features/array/from";
import "core-js/features/map/index";

const memoCache = new Map();
let maxCacheSize = 10;

export default function easyMemo<T = unknown>(memoFn: (...args: any[]) => T, deps: any[]) {
    // tslint:disable-next-line:no-shadowed-variable
    return (...args: any[]): T => {
        if (memoCache.has(cacheKeyFor(memoFn, deps, args))) {
            return memoCache.get(cacheKeyFor(memoFn, deps, args));
        } else {
            // Calculate result of input function
            const result = memoFn.apply(undefined, args);
            memoCache.set(cacheKeyFor(memoFn, deps, args), result);

            cleanUpMemo(memoFn);

            return result;
        }
    };
}

export function overrideMaxCacheSize(size: number) {
    maxCacheSize = size;
}

export function clear() {
    memoCache.clear();
}

const getMatchingMapKeysFor = (partialKey: string): string[] => {
    return Array.from(memoCache.keys()).filter((singleKey: string) => singleKey.includes(partialKey));
};

const cleanUpMemo = <T>(memoFn: (...args: any[]) => T) => {
    const matchingKeys = getMatchingMapKeysFor(memoFn.toString());

    if (matchingKeys.length > maxCacheSize) {
        const toRemove = matchingKeys.length - maxCacheSize;
        for (let i = 0; i < toRemove; i++) {
            memoCache.delete(matchingKeys[i]);
        }
    }
};

const cacheKeyFor = (memoFn: (...args: any[]) => unknown, deps: any[], ...args: any[]): string => {
    return `${ memoFn.toString() }-${ deps.map(dep => cacheKeyFromStrategy(dep)).join(",") }-${ JSON.stringify(args) }`;
};

const cacheKeyFromStrategy = (dependency: any) => {
    // Cache Key Strategy:
    // Functions or Array       => .toString()
    // Object                   => JSON.stringify()
    if (typeof dependency === "object"){
        return JSON.stringify(dependency);
    }

    return dependency === null || dependency === undefined ? "" : dependency.toString();
}
