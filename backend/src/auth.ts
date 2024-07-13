import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getUser, createUser } from "./db";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const existingUser = await getUser(username);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(username, hashedPassword);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await getUser(username);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign(
        { username },
        process.env.JWT_SECRET as string
      );
      res.json({ accessToken });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
