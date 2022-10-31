import { Router } from "express";
import { PrismaClient } from '@prisma/client'

const router = new Router();
const prisma = new PrismaClient();


router.get('/', async (req, res, next) => {
  try {
    const data = await prisma.user.findMany();
    res.json(data)
    return;
  } catch (error) {
    console.error(error)
  }
  
  res.json('Hello from twitler');
})

export { router };