import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { dataStore } from '../data/store.js';
import { generateToken, AuthRequest } from '../middleware/auth.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full Name is required.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
    if (!phone || phone.trim().length < 8) {
      return res.status(400).json({ success: false, message: 'Please provide a valid contact phone number.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Password confirmation does not match.' });
    }

    const existing = await dataStore.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'This email is already registered. Please log in.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await dataStore.createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      role: 'USER',
      favorites: []
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Welcome to Temple Ease.',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        favorites: newUser.favorites,
        createdAt: newUser.createdAt
      }
    });
  } catch {
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await dataStore.findUserByEmail(email);
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your email and password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your email and password.' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        favorites: user.favorites,
        createdAt: user.createdAt
      }
    });
  } catch {
    res.status(500).json({ success: false, message: 'Authentication failed.' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await dataStore.findUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        favorites: user.favorites,
        createdAt: user.createdAt
      }
    });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name cannot be empty.' });
    }

    const updated = await dataStore.updateUser(req.user!.id, {
      name: name.trim(),
      phone: phone ? phone.trim() : undefined
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
        favorites: updated.favorites,
        createdAt: updated.createdAt
      }
    });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ success: false, message: 'New password and confirmation do not match.' });
    }

    const user = await dataStore.findUserById(req.user!.id);
    if (!user || !user.password) {
      return res.status(404).json({ success: false, message: 'User record not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    await dataStore.updateUser(user._id, { password: hashedNew });

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
};
