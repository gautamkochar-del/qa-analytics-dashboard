import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "super_secret_qa_dashboard_key_12345",
    { expiresIn: "30d" }
  );
};

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // For self-registration, they just get default no-permissions role or we leave roleId null
        // In a real app we'd fetch the ID of the 'Viewer' or 'Tester' role. For now, roleId is optional.
      },
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: "Viewer", // Fallback for API response structure
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Your account has been disabled. Contact an administrator." });
    }

    if (await bcrypt.compare(password, user.password)) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role?.name || "Viewer",
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const getMe = async (req, res) => {
  try {
    // req.user is attached by authMiddleware protect
    res.json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load profile" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        role: { select: { id: true, name: true } },
        department: { select: { id: true, name: true } },
        team: { select: { id: true, name: true } },
      },
      orderBy: {
        name: "asc",
      },
    });
    // Format to match expected frontend structure if needed
    const formatted = users.map(u => ({
      ...u,
      role: u.role?.name || "Viewer",
      roleId: u.role?.id,
      departmentId: u.department?.id,
      teamId: u.team?.id,
    }));
    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load users" });
  }
};
