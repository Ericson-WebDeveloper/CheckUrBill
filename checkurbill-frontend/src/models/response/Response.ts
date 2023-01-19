export interface IGenericResponse<T> {
    status: string | number;
    message?: string;
    data?: T;
    error?: any;
    errors?: Array<unknown>;
}


export interface IGenericResponseWPagesState<T> {
  current_page: number | null;
  data: T | [] | null;
  first_page_url: string | null;
  from: number | null;
  last_page: number | null;
  last_page_url: string | null;
  // links: { 
  //         url: string | null,
  //         label: string | null,
  //         active: boolean
  //         }[] | null;
  // https://github.com/amitavroy/doctor-app/blob/master/resources/js/interfaces/IPaginate.ts
  links: Array<unknown> | any | null;
  next_page_url: string | null;
  path: string | null;
  per_page: number | null;
  prev_page_url: string | null;
  to: number | null;
  total: number | null;
}