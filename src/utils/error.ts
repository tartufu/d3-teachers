export const generateErrorObj = (errMsg: string, statusCode: number) => {
  const error = new Error(errMsg);
  (error as any).status = statusCode;
  return error;
};
