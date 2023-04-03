const bcrypt = require("bcrypt");

export const hashedString = async (normalString: string): Promise<string> => {
  return await bcrypt.hash(normalString, 8);
};

export const validateHashedString = async (
  normalString: string,
  hashedString: string
): Promise<boolean> => {
  return await bcrypt.compare(normalString, hashedString);
};
