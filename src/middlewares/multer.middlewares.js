import multer from "multer";
import path from "path";
import fs from "fs";

// Make sure upload folder exists
const uploadPath = path.join(process.cwd(), "public", "temp");
fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });




// import multer from "multer";
// import path from "path"; 

// // const storage = multer.diskStorage({
// //     destination: function (req, file, cb) {
// //       cb(null, '/public/temp')
// //     },
// //     filename: function (req, file, cb) {
// //       // const userProvidedName = req.body?.username || 'defaultName'; 
// //       // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
// //       // const extension = path.extname(file.originalname);
// //       // cb(null, `${userProvidedName}-${uniqueSuffix}${extension}`);
// //       cb(null, file.originalname);
// //     }
// //   })
//   const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
     
//         cb(null, path.join(process.cwd(), "public", "temp")); // absolute path from project root
      
//       // cb(null, "/public/temp");
//     },
//     filename: function (req, file, cb) {
    
//       cb(null, Date.now() + "-" + file.originalname);
//     },
//   });
//    export const upload = multer({ storage });



