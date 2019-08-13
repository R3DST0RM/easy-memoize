import easyMemo, { clearCache } from "../src/index";

describe("easyMemo", () => {

    it("should return the result of a function", () => {
        expect(easyMemo((a, b) => a * b, 1, 2)).toBe(2);
    });

    it("should not execute again if dependencies are the same", () => {
        const memoFn = jest.fn().mockImplementation((a, b) => a * b);
        
        expect(easyMemo(memoFn, 1, 2)).toBe(2);
        expect(easyMemo(memoFn, 1, 2)).toBe(2);

        expect(memoFn).toBeCalledTimes(1);
    });

    it("should not execute again if another function has been run in the mean time", () => {
        const memoFn = jest.fn().mockImplementation((a, b) => a * b);
        clearCache();

        expect(easyMemo(memoFn, 1, 2)).toBe(2);
        expect(easyMemo(memoFn, 1, 3)).toBe(3);
        expect(easyMemo(memoFn, 1, 2)).toBe(2);
        expect(easyMemo(memoFn, 1, 3)).toBe(3);
        
        expect(memoFn).toBeCalledTimes(2);
    })
})