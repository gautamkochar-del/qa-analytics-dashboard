import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "super_secret_qa_dashboard_key_12345"
      );

      // Get user from token
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: { select: { name: true } },
          isActive: true,
        },
      });

      if (!req.user || !req.user.isActive) {
        return res.status(401).json({ message: "Not authorized or user disabled" });
      }

      // Map relational role back to string for easier role checking
      req.user.role = req.user.role?.name || "Viewer";

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
