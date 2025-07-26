export const isNumeric = (str: string): boolean => {
  return !isNaN(Number(str)) && str.trim() !== '';
};
