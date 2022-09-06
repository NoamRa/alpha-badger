import { renderHook, act } from "@testing-library/react";
import { useSessionStorageItem, useLocalStorageItem } from "./useStorage";

describe("Test useStorage", () => {
  const myKey = "myKey";
  const otherKey = "otherKey";
  const stringValue = "string value";
  const otherStringValue = "other string value";
  const numberValue = 345;
  const booleanValue = true;
  const arrayValue = [stringValue, numberValue, booleanValue];
  const objectValue = {
    foo: "bar",
    otherKey: arrayValue,
  };

  jest.spyOn(Object.getPrototypeOf(window.sessionStorage), "getItem");
  jest.spyOn(Object.getPrototypeOf(window.localStorage), "getItem");
  jest.spyOn(Object.getPrototypeOf(window.sessionStorage), "setItem");
  jest.spyOn(Object.getPrototypeOf(window.localStorage), "setItem");

  beforeEach(() => {
    window.sessionStorage.clear();
    window.localStorage.clear();
    jest.clearAllMocks();
  });
  [
    { storage: localStorage, hook: useLocalStorageItem },
    {
      storage: sessionStorage,
      hook: useSessionStorageItem,
    },
  ].forEach(({ storage, hook }) => {
    describe(`Test ${hook.name}`, () => {
      it(`${name} - should pass sanity`, () => {
        expect(storage.getItem(myKey)).toBe(null);
        const { result } = renderHook(() => hook<string>(myKey, stringValue));

        const [value1, setValue] = result.current;

        expect(value1).toBe(stringValue);
        expect(storage.getItem).toHaveBeenCalledWith(myKey);
        expect(storage.setItem).toHaveBeenCalledWith(
          myKey,
          JSON.stringify(stringValue),
        );
        expect(JSON.parse(storage.getItem(myKey) as string)).toBe(stringValue);

        act(() => {
          setValue(otherStringValue);
        });

        const [value2] = result.current;
        expect(value2).toBe(otherStringValue);
        expect(JSON.parse(storage.getItem(myKey) as string)).toBe(
          otherStringValue,
        );
      });

      it.each([
        ["string", otherStringValue],
        ["number", numberValue],
        ["boolean", booleanValue],
        ["array", arrayValue],
        ["object", objectValue],
      ])(`${name} - should work on input of type %s`, (_, valueUnderTest) => {
        expect(storage.getItem(otherKey)).toStrictEqual(null);
        const { result } = renderHook(() => hook(otherKey, valueUnderTest));

        const [value] = result.current;

        expect(value).toBe(valueUnderTest);
        expect(JSON.parse(storage.getItem(otherKey) as string)).toStrictEqual(
          valueUnderTest,
        );
      });

      it("should be able to accept function as initial value", () => {
        expect(storage.getItem(otherKey)).toBe(null);
        const { result } = renderHook(() =>
          hook<number>(myKey, () => numberValue),
        );

        const [value1, setValue] = result.current;

        expect(value1).toBe(numberValue);

        act(() => {
          setValue(789);
        });

        const [value2] = result.current;
        expect(value2).toBe(789);
        expect(JSON.parse(storage.getItem(myKey) as string)).toBe(789);
      });

      it(`${name} - should read value from storage when init (hydrate)`, () => {
        storage.setItem(myKey, JSON.stringify("bla"));
        const { result } = renderHook(() => hook<number>(myKey));

        const [value1] = result.current;
        expect(value1).toBe("bla");
      });
    });
  });
});
