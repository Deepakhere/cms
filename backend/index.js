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
app.use(express.json());

app.use(
  cors({
    origin: ["https://pagebuilderhere.netlify.app/"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
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
  if (req.session.userData) {
    return res.json({ valid: true });
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

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Hello from server side!" });
});
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}!`);
});
