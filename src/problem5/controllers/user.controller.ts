import { Request, Response } from 'express'
import { UserModel } from '../database/models/user.model'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../constants/config'

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body
    const user = await UserModel.findOne({ email }).select('email').lean()
    if (user) {
      return res.status(400).json({ message: 'Email already exists' })
    }
    // password hashing in frontend
    const hashedPassword = password
    await UserModel.create({
      email,
      name,
      password: hashedPassword,
    })
    return res.status(201).json({ message: 'User created' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await UserModel.findById(id).lean()
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({ user })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// search and filter user
export const getUserBySearch = async (req: Request, res: Response) => {
  try {
    const { search, role } = req.query
    const query: any = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    if (role) {
      query.role = role
    }

    const users = await UserModel.find(query).lean()
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' })
    }
    return res.status(200).json({ users })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { email, name } = req.body
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { email, name },
      { new: true }
    ).lean()
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({ message: 'User updated', data: updatedUser })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const softDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deletedUser = await UserModel.findByIdAndUpdate(id, { deleted: true }, { new: true }).lean()
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({ message: 'User soft deleted' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deletedUser = await UserModel.findByIdAndDelete(id).lean()
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({ message: 'User deleted' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
