import cron from "node-cron";
import generateHTMLContent from "../generatepage/generateHTMLContent.js";
import homePageDataSchema from "../models/home_schema_models.js";

const generatePage = async (req, res) => {
  const { slug } = req.params;

  const slugWithSlash = slug.startsWith("/") ? slug : `/${slug}`;

  try {
    const pageData = await homePageDataSchema.findOne({ URL: slugWithSlash });
    const contentPage = pageData;

    if (contentPage) {
      const dateTimeString = `${contentPage.publishDate}T${contentPage.publishTime}:00`;
      const epochTimestamp = new Date(dateTimeString).getTime() / 1000;

      let isPublished = Date.now() > new Date(epochTimestamp);

      if (isPublished) {
        let htmlPage = generateHTMLContent(contentPage);

        contentPage.status = "published";

        // Validate the data before saving
        const validationResult = contentPage.validateSync();
        if (validationResult) {
          console.error("Validation Error:", validationResult.errors);
          res.status(400).send("Validation Error");
          return;
        }

        await contentPage.save();
        res.send(htmlPage);
      } else {
        res.status(404).send("Page not found or not yet published!");
      }
    } else {
      res.status(404).send("Page not found!");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

cron.schedule("* * * * *", async () => {
  console.log("Running cron job...");

  const allPages = await homePageDataSchema.find({});

  allPages.forEach(async (page) => {
    const dateTimeString = `${page.publishDate}T${page.publishTime}:00`;

    const epochTimestamp = new Date(dateTimeString).getTime() / 1000;

    if (Date.now() >= new Date(epochTimestamp)) {
      page.status = "published";
      page.isPublished = true;
      await page.save();
      // console.log(`Page ${page.URL} is published.`);
    }
  });
});

export default generatePage;
