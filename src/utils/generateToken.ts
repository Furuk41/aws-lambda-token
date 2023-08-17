export function generateUniqueToken(length: number): string {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";

  if (length > characters.length) {
    throw new Error("Desired token length is too long for the character set.");
  }

  while (token.length < length) {
    const randomCharacter =
      characters[Math.floor(Math.random() * characters.length)];
    if (!token.includes(randomCharacter)) {
      token += randomCharacter;
    }
  }

  return token;
}
