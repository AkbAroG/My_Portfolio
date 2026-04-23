// import mongoose from "mongoose";

// const dbConnection = () => {
//   mongoose
//     .connect(process.env.MONGO_URI)
//     // .connect("mongodb+srv://akbaroofficial041_db_user:6o6CV6kaKAQCelju@cluster0.tfbngdq.mongodb.net/myPortfolio" )
//     .then(() => {
//       console.log("Connected to database!");
//     })
//     .catch((err) => {
//       console.log("Some error occured while connecting to database:", err);
//     });
// };

// export default dbConnection;

import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "portfolio",
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log("❌ DB Error:", error.message);
  }
};

export default dbConnection;