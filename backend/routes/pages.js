import express from "express";
import upload from "../controller/multerimage.js";
import pageSaveData from "../controller/savedata.js";
import homeController from "../controller/homeController.js";
import getHomePageData from "../controller/getHomePageData.js";
import generatePage from "../controller/handlefrontdata.js";
import deleteDataItem from "../controller/deletedataitem.js";
import getAllURLs from "../controller/bloglist.js";
import { getPageById, updatePage } from "../controller/editPageController.js";

const router = express.Router();

// Page management routes
router.post("/homepagedata", upload.single("image"), homeController);
router.post("/pagesavedata", upload.single("image"), pageSaveData);
router.get("/gethomedata", getHomePageData);
router.get("/generatepage/:slug", generatePage);
router.delete("/deletedata/:id", deleteDataItem);
router.get("/bloglist", getAllURLs);

// Edit page routes
router.get("/page/:id", getPageById);
router.put("/page/:id", upload.single("image"), updatePage);

export default router;
