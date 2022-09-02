import { genShortId } from "./generateId";

describe("Test ID generation", () => {
  it("should create unique IDs with prefix", () => {
    // for genShortId and its 3 random bytes, 1000 ids should be
    // enough of a validation for uniqueness
    const length = 1000;
    const prefix = "test-short-id";
    const IDs = [
      ...new Set(Array.from({ length }, () => genShortId("test-short-id"))),
    ];
    expect(IDs).toHaveLength(length);
    expect(IDs.every((id) => id.includes(prefix))).toBe(true);
  });
});
