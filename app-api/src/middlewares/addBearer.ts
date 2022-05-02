import { Request, Response, NextFunction } from "express";

export function addBearer(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.jwt;
  if (token) req.headers.authorization = `Bearer ${token}`;
  next();
}
