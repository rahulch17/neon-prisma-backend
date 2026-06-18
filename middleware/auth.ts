import { Request, Response, NextFunction } from 'express'

const MY_KEY = 'rahul@123'

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers['x-api-key']

  if (apiKey !== MY_KEY) {
    return res.status(401).json({
      message: 'Unauthorized'
    })
  }

  next()
}