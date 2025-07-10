import session from "express-session";
import MongoStore from "connect-mongo";

const sessionConfig = {
  secret:
    process.env.SESSION_SECRET ||
    "your-super-secret-key-change-this-in-production",
  resave: false,
  saveUninitialized: false,
  name: "sessionId", // Custom session name
  store: MongoStore.create({
    mongoUrl: process.env.MONGO,
    touchAfter: 24 * 3600, // lazy session update
    ttl: 24 * 60 * 60, // 24 hours
  }),
  cookie: {
    secure: process.env.NODE_ENV === "production", // true for HTTPS in production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: "lax", // Use 'lax' for development
    domain: undefined, // Let browser handle domain
  },
  proxy: true,
};

export default session(sessionConfig);
