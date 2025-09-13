export function generateRandomString(count = 10, length = 12, separator = "") {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let finalString = "";

  for (let i = 0; i < count; i++) {
    let chunk = "";
    for (let j = 0; j < length; j++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      chunk += characters[randomIndex];
    }
    finalString += chunk;
    if (i < count - 1) finalString += separator;
  }

  return finalString;
}
