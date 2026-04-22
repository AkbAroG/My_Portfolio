import mongoose from "mongoose";

const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    // .connect("mongodb+srv://akbaroofficial041_db_user:6o6CV6kaKAQCelju@cluster0.tfbngdq.mongodb.net/myPortfolio" )
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((err) => {
      console.log("Some error occured while connecting to database:", err);
    });
};

export default dbConnection;