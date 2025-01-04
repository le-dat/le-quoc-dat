import { Router } from 'express'
import {
  register,
  login,
  logout,
  refresh_token,
} from '../controllers/auth.controller'
import { authenticateToken } from '../middleware/auth.middleware'

const authRoutes = Router()

authRoutes.post('/register', register)
authRoutes.post('/login', login)
authRoutes.post('/logout', authenticateToken, logout)
authRoutes.post('/refresh-token', refresh_token)

export default authRoutes
