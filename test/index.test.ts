import easyMemo, { clear } from "../src";

describe("easyMemo", () => {

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
        clear();

        expect(easyMemo(memoFn, [])(1, 2)).toBe(2);
        expect(easyMemo(memoFn, [])(1, 3)).toBe(3);
        expect(easyMemo(memoFn, [])(1, 2)).toBe(2);
        expect(easyMemo(memoFn, [])(1, 3)).toBe(3);
        
        expect(memoFn).toBeCalledTimes(2);
    });

    it("should not execute again if an object will be returned", () => {
        const memoFn = jest.fn().mockImplementation((value) => ({ randomProp: 1, value }));
        clear();

        expect(easyMemo(memoFn, [])("abc")).toEqual({ randomProp: 1, value: "abc" });
        expect(easyMemo(memoFn, [])("abc")).toEqual({ randomProp: 1, value: "abc" });

        expect(memoFn).toBeCalledTimes(1);
    });

    it("should return the same object if the cache hits", () => {
        const memoFn = jest.fn().mockImplementation((value) => ({ randomProp: 1, value }));
        clear();

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
   it("returns cached value for fibonacci", () => {
       const fibonacci = (num: number): number => num <= 1 ? 1 : fibonacci(num - 1) + fibonacci(num - 2);
       const heavyCalc = jest.fn().mockImplementation(() => fibonacci(10));

       expect(easyMemo(heavyCalc, [fibonacci])()).toBe(89);
       expect(easyMemo(heavyCalc, [fibonacci])()).toBe(89);

       expect(heavyCalc).toBeCalledTimes(1);
   })
});
