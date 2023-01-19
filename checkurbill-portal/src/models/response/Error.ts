export interface ErrorInterface {
  message?: string;
  error?: string;
  errors?: Array<unknown>;
  data: {
    errors?: Array<unknown>;
    error?: string;
    message?: string;
  } | null;
  status: number | string;
}
