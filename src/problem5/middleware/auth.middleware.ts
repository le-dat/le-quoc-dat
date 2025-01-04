import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { RefreshTokenModel } from '../database/models/refresh-token.model'
import { config } from '../constants/config'

export const generateTokens = async (userId: string, email: string) => {
  const access_token = jwt.sign({ email }, config.ACCESS_TOKEN_SECRET, {
    expiresIn: '2m', // Access token expires in 2 minutes
  })
  const refresh_token = jwt.sign({ userId }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: '10m', // Refresh token expires in 10 minutes
  })

  await RefreshTokenModel.findOneAndUpdate(
    { user_id: userId },
    { token: refresh_token },
    { upsert: true, new: true }
  )

  return { access_token: access_token, refresh_token: refresh_token }
}

export const authenticateToken = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token)
    return res.status(401).json({ message: 'Access token is required' })

  jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid access token' })
    req.user = user
    next()
  })
}
