declare function predict(
  url: string,
  success: (response: any) => void,
  error: (error: any) => void
): void;

export default predict;
