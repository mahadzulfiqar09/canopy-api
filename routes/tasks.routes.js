const express = require("express");
const controller = require("../controllers/tasks.controller");
const { validateCreate, validateUpdate } = require("../middleware/validateTask");
const requireApiKey = require("../middleware/apiKeyAuth");

const router = express.Router();

// Resources are nouns, methods are verbs: /tasks, not /getTasks.
router.get("/", controller.listTasks);
router.get("/:id", controller.getTask);

router.post("/", requireApiKey, validateCreate, controller.createTask);
router.put("/:id", requireApiKey, validateUpdate, controller.updateTask);
router.delete("/:id", requireApiKey, controller.deleteTask);

module.exports = router;
