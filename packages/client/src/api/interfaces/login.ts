export type LoginResponse = LoginSuccessResponse | LoginFailureResponse;

export interface LoginSuccessResponse {
  id: number,
  messages: unknown[],
  msg: "",
  num_tries: number,
  success: 1,
  token: string,
  username: string,
}

export interface LoginFailureResponse {
  id: null,
  messages: unknown[],
  msg: string,
  num_tries: number,
  success: 0,
  username: string
}
