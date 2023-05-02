const mongoose = require("mongoose");
const DB = process.env.MONGO_URL;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(DB);
  console.log('Successfully connected to MongoDB');
}
