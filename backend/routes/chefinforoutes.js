const express = require("express");
const router = express.Router();
const chefController = require("../controllers/chefinfocontroller");

router.get("/profile/:id", chefController.getChefProfile);
router.put("/profile/:id", chefController.updateChefProfile);

module.exports = router;