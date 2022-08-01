import express, { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getClientInfo = async (req: Request | any, res: Response) => {
  //return res.status(200).json({ success: true, message: 'Got Client' });
  try {
    const clientInfoData = await prisma.client.findUnique({
      where: {
        userId: req.user.id,
      },
    });
    if (!clientInfoData) {
      return res
        .status(404)
        .json({
          success: false,
          mesasge: `No user found with Id ${req.user.id}`,
        });
    }
    return res.status(200).json({ data: clientInfoData });
  } catch (error) {
    console.log(error);
  }
};
