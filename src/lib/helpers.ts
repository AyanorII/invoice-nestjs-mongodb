export const createAlphabet = (): string[] => {
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  return alphabet;
};

export const createNumbers = (): number[] => {
  return [...Array(10).keys()];
};

export const sample = (array: any[]): number => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};
