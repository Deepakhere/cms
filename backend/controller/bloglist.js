import homePageDataSchema from "../models/home_schema_models.js";

const getAllURLs = async (req, res) => {
    try {
        const urls = await homePageDataSchema.find({}, 'URL');

        res.json(urls);
    } catch (error) {
        console.error('Error fetching URLs:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export default  getAllURLs;
