import mongoose from "mongoose";


async function main() {
    await mongoose.connect("mongodb+srv://deepgupta1410:cms%4042@cms.rpymqdg.mongodb.net/")
}
main().then(()=>console.log("Connected to MongoDB"))
.catch((err)=>console.log(err));