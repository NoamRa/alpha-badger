import crypto from "node:crypto";

const generateIdFactory = (length: number) => (prefix: string) =>
  `${prefix}-${crypto.randomBytes(length).toString("hex")}`;

export const genShortId = generateIdFactory(3);
