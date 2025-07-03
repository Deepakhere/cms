import mongoose from "mongoose";

const RegisterSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const RegisterModel = mongoose.model("User", RegisterSchema);
export default RegisterModel;
