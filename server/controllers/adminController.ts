import { Request, Response } from 'express';
import QRCode from 'qrcode';
import { dataStore } from '../data/store.js';
import { getDBStatus } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';

export const getSystemStatus = (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    app: 'Temple Ease — Multi-Temple Information & Visitor Assistance System',
    version: '2.0.0',
    db: getDBStatus()
  });
};

export const generateGeneralQr = async (req: Request, res: Response) => {
  try {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol || 'http';
    const defaultUrl = `${protocol}://${host}/temples`;
    const targetUrl = (req.query.url as string) || (req.body && req.body.url) || defaultUrl;

    const qrDataUrl = await QRCode.toDataURL(targetUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#7B1D16',
        light: '#FFFFFF'
      }
    });

    res.json({
      success: true,
      targetUrl,
      qrDataUrl
    });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to generate QR.' });
  }
};

export const getDashboardStats = async (_req: AuthRequest, res: Response) => {
  try {
    const stats = await dataStore.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats.' });
  }
};

export const getAllUsers = async (_req: AuthRequest, res: Response) => {
  try {
    const users = await dataStore.getAllUsers();
    res.json({ success: true, count: users.length, data: users });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch registered users.' });
  }
};
