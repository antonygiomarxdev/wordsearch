export class CustomError extends Error {
  statusCode: number;
  details?: any; // Opcional: detalles adicionales del error

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name; // Mantener el nombre de la clase en el error
    Object.setPrototypeOf(this, CustomError.prototype); // Correct prototype chain
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string = 'Petición incorrecta', details?: any) {
    super(message, 400, details);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Recurso no encontrado', details?: any) {
    super(message, 404, details);
  }
}
