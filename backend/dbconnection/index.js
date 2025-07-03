import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const uri = process.env.MONGO;

async function main() {
  await mongoose.connect(uri);
}
main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
