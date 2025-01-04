import { Router } from 'express'
import {
  createUser,
  getUser,
  updateUser,
  softDeleteUser,
  deleteUser,
} from '../controllers/user.controller'
import { authenticateToken } from '../middleware/auth.middleware'

const userRoutes = Router()

userRoutes.get('/:id', authenticateToken, getUser)
userRoutes.post('/', authenticateToken, createUser)
userRoutes.put('/:id', authenticateToken, updateUser)
userRoutes.patch('/:id', authenticateToken, softDeleteUser)
userRoutes.delete('/:id', authenticateToken, deleteUser) 

export default userRoutes
