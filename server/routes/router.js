const express = require("express");
const { upload } = require("../utils/upload.js");
const { authentication } = require("../middleware/authentication.js");
const {
  _create,
  _delete,
  _read,
  _update,
} = require("../controller/factoryController.js");

const {
  signupHandler,
  loginHandler,
  forgetPassword,
  resetPassword,
  updatePassword,
  sendEmail,
  logoutHandler,
} = require("../controller/accountController.js");
const {
  chatCreate,
  chatDelete,
  chatRead,
  chatUpdate,
} = require("../controller/chatController.js");

const router = express.Router();
const chatRouter = express.Router();

const files = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "chatFile", maxCount: 10 },
]);

//user account route
router.route("/signup").post(files, signupHandler);

router.route("/login").post(loginHandler);

router.route("/logout").post(logoutHandler);

router.route("/forgetPassword").post(forgetPassword);

router.route("/resetPassword").post(resetPassword);

router.route("/updatePassword").put(authentication, updatePassword);

//factory route
router
  .route("/:table")
  .post(authentication, files, _create)
  .get(authentication, _read)
  .put(authentication, files, _update)
  .delete(authentication, _delete);

//chat route
chatRouter.route("/:id").get(authentication, chatRead);
chatRouter
  .route("/")
  .post(authentication, files, chatCreate)
  .get(authentication, chatRead)
  .put(authentication, files, chatUpdate)
  .delete(authentication, chatDelete);

module.exports = { router, chatRouter };
