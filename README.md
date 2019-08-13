# easy-memoize
Memoization should be made easy. easy-memoize will help you with it.

# Usage

The usage of this library is as easy as 1, 2, 3. Just wrap it around your called function and pass in the arguments as "dependencies".

```javascript
import easyMemo from "easy-memoize";

/* ... */

// On first call calculates the result of 1 * 2, if this code every gets called again, the cached result will be returned.
easyMemo((a, b) => a * b, 1, 2); // returns: 2

// It returns the same object if the dependency is the same ( === safe)
easyMemo((value) => ({ value, randomProp: "abc" }), "R3DST0RM"); // returns: { value: "R3DST0RM", randomProp: "abc" }
```
