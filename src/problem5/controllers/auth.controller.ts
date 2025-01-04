import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { RefreshTokenModel } from '../database/models/refresh-token.model'
import { UserModel } from '../database/models/user.model'
import { generateTokens } from '../middleware/auth.middleware'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body
    const user = await UserModel.findOne({ email }).select('email').lean()
    if (user) {
      return res.status(400).json({ message: 'Email already exists' })
    }
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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email })
      .select('name email role password')
      .lean()
    if (!user) {
      return res.status(400).json({ message: 'Email not found' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Password is incorrect' })
    }

    const tokens = await generateTokens(user._id.toString(), email)
    return res
      .status(200)
      .json({ message: 'Login successful', data: { tokens, user } })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const refresh_token = req.body.refresh_token
    await RefreshTokenModel.findOneAndDelete({ token: refresh_token }).lean()
    return res.status(200).json({ message: 'Logout successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const refresh_token = async (req: Request, res: Response) => {
  try {
    const refresh_token = req.body.refresh_token
    if (!refresh_token) {
      return res.status(400).json({ message: 'Refresh token is required' })
    }

    const refreshTokenDoc = await RefreshTokenModel.findOne({
      token: refresh_token,
    }).lean()
    if (!refreshTokenDoc) {
      return res.status(400).json({ message: 'Refresh token is invalid' })
    }

    const user = await UserModel.findOne({ _id: refreshTokenDoc.user_id })
      .select('email')
      .lean()
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    const tokens = await generateTokens(user._id.toString(), user.email)
    return res.status(200).json({ message: 'Token refreshed', data: tokens })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
