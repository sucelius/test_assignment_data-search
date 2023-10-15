import { Response, Request, NextFunction } from "express";

export const delayMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const delay: number = 5000;

  setTimeout(next, delay);
};
