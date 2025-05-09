import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../repositories/auth.repository';
import { HttpStatus } from '../utils/httpStatus';
import { createResponse, createErrorResponse } from '../utils/response';

export const registerService = async (name: string, email: string, password: string) => {
    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return createErrorResponse('Email already exists', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await createUser(name, email, hashedPassword);

        return createResponse(HttpStatus.CREATED, true, 'User registered successfully', createdUser);
    } catch (err: any) {
        return createErrorResponse('An unexpected error occurred');
    }
};

export const loginService = async (email: string, password: string) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return createErrorResponse('User not found', HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return createErrorResponse('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    return createResponse(HttpStatus.OK, true, 'Login successful', { token });
  } catch (err: any) {
    return createErrorResponse('An unexpected error occurred');
  }
};
