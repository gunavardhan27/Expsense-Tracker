export enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  NotFound = 404,
  Conflict = 409,
  UnprocessableEntity = 422,
  InternalServerError = 500,
}

export enum LogLevel {
  Info = 'INFO',
  Warn = 'WARN',
  Error = 'ERROR',
}
