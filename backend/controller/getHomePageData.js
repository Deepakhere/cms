import homePageDataSchema from "../models/home_schema_models.js";
import RegisterModel from "../models/user_models.js";

const getHomePageData = async (req, res) => {
  try {
    const userId = req.session.userData?._id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await RegisterModel.findById(userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const data = await homePageDataSchema.find({ creatorId: userId });
    console.log("📊 Retrieved page data for user:", userId);
    console.log("Number of pages found:", data.length);
    console.log("Pages with URLs:", data.filter((page) => page.URL).length);
    console.log(
      "Sample data:",
      data.slice(0, 2).map((page) => ({
        title: page.title,
        URL: page.URL,
        status: page.status,
        createdAt: page.createdAt,
      }))
    );
    res.json(data);
  } catch (err) {
    console.error("Error fetching home page data:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export default getHomePageData;
