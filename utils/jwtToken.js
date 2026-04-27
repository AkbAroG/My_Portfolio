// //  export const generateToken = (user, message, statusCode, res) => {
// //   const token = user.generateJsonWebToken();
// //   res
// //     .status(statusCode)
// //     .cookie("token", token, {
// //       expires: new Date(
// //         Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
// //       ),
// //       httpOnly: true,
// //     })
// //     .json({
// //       success: true,
// //       message,
// //       user,
// //       token,
// //     });
// // };
// export const generateToken = (user, message, statusCode, res) => {
//   const token = user.generateJsonWebToken();

//   res.status(statusCode)
//     .cookie("token", token, {
//       httpOnly: true,           // JS cannot access cookie
//       secure: false,            // Localhost ke liye false (HTTPS nahi)
//       sameSite: "none",       // Cross-origin dashboard/posts (axios withCredentials)
//       expires: new Date(
//         Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//       ),
//     })
//     .json({
//       success: true,
//       message,
//       user,
//       token,
//     });
// };

export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  res.status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      secure: true,          // 🔥 MUST be true on Vercel (HTTPS)
      sameSite: "none",      // required for cross-domain frontend/backend
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};