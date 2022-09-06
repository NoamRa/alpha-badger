import { renderHook, act, cleanup } from "@testing-library/react";
import { useSessionStorageItem } from "./useStorage";

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

  it("should pass sanity", () => {
    expect(window.sessionStorage.getItem(myKey)).toBe(null);
    const { result } = renderHook(() =>
      useSessionStorageItem<string>(myKey, stringValue),
    );

    const [value1, setValue] = result.current;

    expect(value1).toBe(stringValue);
    expect(window.sessionStorage.getItem).toHaveBeenCalledWith(myKey);
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
      myKey,
      JSON.stringify(stringValue),
    );
    expect(JSON.parse(window.sessionStorage.getItem(myKey) as string)).toBe(
      stringValue,
    );

    act(() => {
      setValue(otherStringValue);
    });

    const [value2] = result.current;
    expect(value2).toBe(otherStringValue);
    expect(JSON.parse(window.sessionStorage.getItem(myKey) as string)).toBe(
      otherStringValue,
    );
  });

  it.each([
    ["string", otherStringValue],
    ["number", numberValue],
    ["boolean", booleanValue],
    ["array", arrayValue],
    ["object", objectValue],
  ])("should work on input of type %s", (name, valueUnderTest) => {
    expect(window.sessionStorage.getItem(otherKey)).toStrictEqual(null);
    const { result } = renderHook(() =>
      useSessionStorageItem(otherKey, valueUnderTest),
    );

    const [value] = result.current;

    expect(value).toBe(valueUnderTest);
    expect(
      JSON.parse(window.sessionStorage.getItem(otherKey) as string),
    ).toStrictEqual(valueUnderTest);
  });

  it("should be able to accept function as initial value", () => {
    expect(window.sessionStorage.getItem(otherKey)).toBe(null);
    const { result } = renderHook(() =>
      useSessionStorageItem<number>(myKey, () => numberValue),
    );

    const [value1, setValue] = result.current;

    expect(value1).toBe(numberValue);

    act(() => {
      setValue(789);
    });

    const [value2] = result.current;
    expect(value2).toBe(789);
    expect(JSON.parse(window.sessionStorage.getItem(myKey) as string)).toBe(
      789,
    );
  });

  it("should read value from storage when init (hydrate)", () => {
    window.sessionStorage.setItem(myKey, JSON.stringify("bla"));
    const { result } = renderHook(() => useSessionStorageItem<number>(myKey));

    const [value1] = result.current;
    expect(value1).toBe("bla");
  });
});
