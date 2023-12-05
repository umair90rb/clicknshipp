import fs from "fs";

const deleteFile = (path) => {
  if (path && fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

export { deleteFile };
