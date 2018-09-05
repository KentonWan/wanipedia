const express = require("express");
const router = express.Router();

const collaboratorController = require("../controllers/collaboratorController");

router.get("/wikis/:id/collaborators", collaboratorController.index);
router.post("/wikis/:id/collaborators/add", collaboratorController.create);

module.exports = router;