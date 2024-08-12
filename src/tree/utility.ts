let timeout: any;

/**
 * 
 * @param func - function to be debounced
 * @param delay - delay in milliseconds
 * @returns - respons eof function called after the time delay
 */
export const debounce = (func: Function, delay: number) => {
  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};