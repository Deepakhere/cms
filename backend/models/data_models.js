import homePageDataSchema from "./home_schema_models.js";

const getData = async (req, res) => {
  try {
    const data = await homePageDataSchema.find({});
    res.json(data);
  } catch (err) {
    console.log("Error fetching data:", err);
    res.status(500).send("Internal Server Error");
  }
};

export default getData;
