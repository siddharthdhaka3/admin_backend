// interface IResponse {
//     success: boolean;
//     message?: string;
//     data: object | null | any;
//   }
  
//   export type ErrorResponse = IResponse & {
//     error_code: number;
//   };
  
//   // export const createResponse = (
//   //   data: IResponse["data"],
//   //   message?: string
//   // ): IResponse => {
//   //   return { data, message, success: true };
//   // };
  
  export const createResponse = (
    data: object | null | any,
    message?: string
  ): any => {
    const response = { data, message, success: true };
    return response;
  };
  