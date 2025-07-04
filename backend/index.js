import express from "express";
import dotenv from "dotenv";
import "./dbconnection/index.js";

import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import bodyParser from "body-parser";

import cron from "node-cron";
import transporter from "./cronset/emailSender.js";
import homePageDataSchema from "./models/home_schema_models.js";

import upload from "./controller/multerimage.js";
import pageSaveData from "./controller/savedata.js";

import { register, login } from "./controller/users.js";

import homeController from "./controller/homeController.js";

import getHomePageData from "./controller/getHomePageData.js";

import generatePage from "./controller/handlefrontdata.js";

import deleteDataItem from "./controller/deletedataitem.js";

import getAllURLs from "./controller/bloglist.js";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

// Log environment info
console.log("🚀 Starting server...");
console.log("📍 Environment:", process.env.NODE_ENV);
console.log("🔌 Port:", PORT);
console.log("🍪 Secure cookies:", process.env.NODE_ENV === "production");
app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🌐 CORS request from origin:", origin);

      const allowedOrigins =
        process.env.NODE_ENV === "development"
          ? ["http://localhost:3000", "http://localhost:3001"]
          : ["https://pagebuilderhere.netlify.app"];

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        console.log("✅ Origin allowed:", origin);
        callback(null, true);
      } else {
        console.log("Allowed origins:", allowedOrigins);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["POST", "GET", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "your-super-secret-key-change-this-in-production",
    resave: false,
    saveUninitialized: false,
    name: "sessionId", // Custom session name
    cookie: {
      secure: process.env.NODE_ENV === "production", // true for HTTPS in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: process.env.NODE_ENV === "production" ? undefined : undefined, // Let browser handle domain
    },
    proxy: process.env.NODE_ENV === "production", // Trust proxy in production
  })
);

//route
app.post("/register", register);

app.post("/login", login);

app.post("/homepagedata", homeController);

app.post("/pagesavedata", upload.single("image"), pageSaveData);

app.get("/gethomedata", getHomePageData);

app.get("/generatepage/:slug", generatePage);

app.delete("/deletedata/:id", deleteDataItem);

app.get("/bloglist", getAllURLs);

app.get("/isAuthenticate", (req, res) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session data:", req.session);
  console.log("User data in session:", req.session.userData);

  if (req.session.userData) {
    return res.json({ valid: true, user: req.session.userData });
  } else {
    return res.json({ valid: false });
  }
});

cron.schedule("0 8 * * *", async () => {
  console.log("1,2,3,4......");
  const currentDate = new Date();

  let year = currentDate.getFullYear();
  let month =
    currentDate.getMonth() + 1 > 9
      ? currentDate.getMonth() + 1
      : `0${currentDate.getMonth() + 1}`;
  let day =
    currentDate.getDate() > 9
      ? currentDate.getDate()
      : `0${currentDate.getDate()}`;

  let date = `${year}-${month}-${day}`;

  try {
    const users = await homePageDataSchema.find({ publishDate: date });

    users.forEach(async (user) => {
      const mailOptions = {
        from: "deepakhere24@gmail.com",
        to: user.email,
        subject: "Reminder",
        text: `Hello ${user.createdBy}, This is reminder email for your post "${user.title}"`,
      };

      await transporter.sendMail(mailOptions);
      // console.log('Email sent to:', user.email);
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});

// Test session endpoint
app.get("/test-session", (req, res) => {
  if (!req.session.views) {
    req.session.views = 0;
  }
  req.session.views++;

  res.json({
    message: "Session test",
    sessionId: req.sessionID,
    views: req.session.views,
    userData: req.session.userData || null,
  });
});

// Test route
app.get("/", (req, res) => {
  res.json("Hello! I am server!");
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}!`);
});
