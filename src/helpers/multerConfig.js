import multer from "multer";
const uploadDir = `${process.cwd()}/uploads`;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.split(".")[0] + ".xlsx");
  },
});
export { uploadDir };
export default multer({ storage });
