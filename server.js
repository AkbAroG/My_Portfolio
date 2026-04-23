// import app from "./app.js";
// import cloudinary from "cloudinary";

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // app.listen(process.env.PORT  || 3000, () => {
// //   console.log(`Server listening at port ${process.env.PORT}`);
// // });
// const PORT = process.env.PORT ;
// app.listen(PORT, () => {
//   console.log(`Server listening at port ${PORT}`);
// });
import app from "./app.js";
import cloudinary from "cloudinary";
import app from "./app.js";
import dbConnection from "./database/dbConnection.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const PORT = process.env.PORT || 4000;

dbConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
export default app;