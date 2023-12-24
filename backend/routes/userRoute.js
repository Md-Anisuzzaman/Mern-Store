import express from 'express';
import { createUser, getAllusers, loginUser, logoutCurrentUser } from '../controllers/userController.js';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddlware.js';



const router = express.Router();
// router.route("/allusers").post(getAllusers);

router.route("/").post(createUser).get(authenticate,authorizeAdmin,getAllusers)

router.route("/auth").post(loginUser);
router.route("/logout").post(logoutCurrentUser);

export default router;