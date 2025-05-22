import homePageDataSchema from '../models/home_schema_models.js'
import mongoose from 'mongoose';
const deleteDataItem = async (req, res) => {
    const { id } = req.params;

    console.log(id);

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        const deletedRecord = await homePageDataSchema.findByIdAndDelete(id);

        if (!deletedRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
export default deleteDataItem;