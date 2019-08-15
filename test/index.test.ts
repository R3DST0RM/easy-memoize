import easyMemo, { clear, overrideMaxCacheSize } from "../src";

describe("easyMemo", () => {
    beforeEach( () => {
        clear();
    });

    it("should return the result of a function", () => {
        expect(easyMemo((a, b) => a * b, [])(1, 2)).toBe(2);
    });

    it("should not execute again if dependencies are the same", () => {
        const memoFn = jest.fn().mockImplementation((a, b) => a * b);
        
        expect(easyMemo(memoFn, [])(1, 2)).toBe(2);
        expect(easyMemo(memoFn, [])(1, 2)).toBe(2);

        expect(memoFn).toBeCalledTimes(1);
    });

    it("should not execute again if another function has been run in the mean time", () => {
        const memoFn = jest.fn().mockImplementation((a, b) => a * b);

        expect(easyMemo(memoFn, [])(1, 2)).toBe(2);
        expect(easyMemo(memoFn, [])(1, 3)).toBe(3);
        expect(easyMemo(memoFn, [])(1, 2)).toBe(2);
        expect(easyMemo(memoFn, [])(1, 3)).toBe(3);
        
        expect(memoFn).toBeCalledTimes(2);
    });

    it("should not execute again if an object will be returned", () => {
        const memoFn = jest.fn().mockImplementation((value) => ({ randomProp: 1, value }));

        expect(easyMemo(memoFn, [])("abc")).toEqual({ randomProp: 1, value: "abc" });
        expect(easyMemo(memoFn, [])("abc")).toEqual({ randomProp: 1, value: "abc" });

        expect(memoFn).toBeCalledTimes(1);
    });

    it("should return the same object if the cache hits", () => {
        const memoFn = jest.fn().mockImplementation((value) => ({ randomProp: 1, value }));

        const deepEqual = easyMemo(memoFn, [])("abc");
        
        // Verify this is only a shallow comparison and not a deep equality: === returns false
        expect(deepEqual).toEqual({ randomProp: 1, value: "abc" });
        expect(deepEqual).not.toBe({ randomProp: 1, value: "abc" });

        // Verify that we receive the very same object: === returns true
        expect(easyMemo(memoFn, [])("abc")).toBe(deepEqual);
        expect(memoFn).toBeCalledTimes(1);
    });

    it("should re-calculate the result if one dependency changes", () => {
        let a = () => 5;
        const memoFn = jest.fn().mockImplementation((b) => a() * b);
        const memoized = easyMemo(memoFn, [a]);

        expect(memoized(2)).toBe(10);
        expect(memoized(2)).toBe(10);
        expect(memoFn).toBeCalledTimes(1);

        a = () => 10;
        expect(easyMemo(memoFn, [a])(2)).toBe(20);
        expect(easyMemo(memoFn, [a])(2)).toBe(20);
        expect(memoFn).toBeCalledTimes(2);
    })
});

describe("easyMemo - sample memoization", () => {
    beforeEach( () => {
        clear();
    });

   it("returns cached value for fibonacci", () => {
       const fibonacci = (num: number): number => num <= 1 ? 1 : fibonacci(num - 1) + fibonacci(num - 2);
       const heavyCalc = jest.fn().mockImplementation(() => fibonacci(10));

       expect(easyMemo(heavyCalc, [fibonacci])()).toBe(89);
       expect(easyMemo(heavyCalc, [fibonacci])()).toBe(89);

       expect(heavyCalc).toBeCalledTimes(1);
   })
});

describe("easyMemo - Garbage collection", () => {
    beforeEach( () => {
        clear();
    });

    it("invalidates the first memoized result after cachSize is exceeded", () => {
        const memoFn = jest.fn().mockImplementation((a, b) => a * b);

        for (let i = 0; i < 11; i++) {
            expect(easyMemo(memoFn, [])(1, i)).toBe(i);
        }
        expect(memoFn).toBeCalledTimes(11);
        expect(easyMemo(memoFn, [])(1, 0)).toBe(0);
        expect(memoFn).toBeCalledTimes(12);
    });

    it("allows to override the cache size and respects that", () => {
        const memoFn = jest.fn().mockImplementation((a, b) => a * b);
        overrideMaxCacheSize(2);

        for (let i = 0; i < 3; i++) {
            expect(easyMemo(memoFn, [])(1, i)).toBe(i);
        }
        expect(memoFn).toBeCalledTimes(3);
        expect(easyMemo(memoFn, [])(1, 0)).toBe(0);
        expect(memoFn).toBeCalledTimes(4);
    });
});

describe("easyMemo - Dependencies", () => {
    beforeEach( () => {
        clear();
    });

    it("doesn't cache if one dependency is an object", () => {
        const obj = { a: 5, b: 5 };
        const memoFn = jest.fn().mockImplementation(() => obj.a + obj.b);

        expect(easyMemo(memoFn, [obj])()).toBe(10);
        expect(easyMemo(memoFn, [obj])()).toBe(10);
        expect(memoFn).toBeCalledTimes(1);

        obj.b = 10;
        expect(easyMemo(memoFn, [obj])()).toBe(15);
        expect(easyMemo(memoFn, [obj])()).toBe(15);
        expect(memoFn).toBeCalledTimes(2);
    });

    it("dependency array of function is valid", () => {
        let depFn = () => 5;
        const memoFn = jest.fn().mockImplementation(() => depFn());

        expect(easyMemo(memoFn, [depFn])()).toBe(5);
        expect(easyMemo(memoFn, [depFn])()).toBe(5);
        expect(memoFn).toBeCalledTimes(1);

        depFn = () => 10;
        expect(easyMemo(memoFn, [depFn])()).toBe(10);
        expect(easyMemo(memoFn, [depFn])()).toBe(10);
        expect(memoFn).toBeCalledTimes(2);
    });

    it("dependency array of null is valid", () => {
        const memoFn = jest.fn().mockImplementation(() => 5);

        expect(easyMemo(memoFn, [null])()).toBe(5);
        expect(easyMemo(memoFn, [null])()).toBe(5);
        expect(memoFn).toBeCalledTimes(1);
    });

    it("dependency array of undefined is valid", () => {
        const memoFn = jest.fn().mockImplementation(() => 5);

        expect(easyMemo(memoFn, [undefined])()).toBe(5);
        expect(easyMemo(memoFn, [undefined])()).toBe(5);
        expect(memoFn).toBeCalledTimes(1);
    });
})