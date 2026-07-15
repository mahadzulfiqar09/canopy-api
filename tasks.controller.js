const store = require("../data/store");
const ApiError = require("../utils/ApiError");

/**
 * GET /api/tasks
 * Optional query params: ?bed=deep-work  ?done=true
 */
function listTasks(req, res) {
  const { bed, done } = req.query;
  const filters = {};
  if (bed) filters.bed = bed;
  if (done !== undefined) filters.done = done === "true";

  const tasks = store.getAll(filters);
  res.status(200).json({
    count: tasks.length,
    tasks,
  });
}

/**
 * GET /api/tasks/:id
 */
function getTask(req, res, next) {
  const task = store.getById(req.params.id);
  if (!task) return next(ApiError.notFound(`No task with id "${req.params.id}".`));
  res.status(200).json({ task });
}

/**
 * POST /api/tasks
 * Body: { title: string, bed?: "deep-work" | "admin" | "learning" }
 */
function createTask(req, res) {
  const { title, bed } = req.body;
  const task = store.create({ title, bed });
  res.status(201).json({ task });
}

/**
 * PUT /api/tasks/:id
 * Body: any of { title, bed, done }
 */
function updateTask(req, res, next) {
  const existing = store.getById(req.params.id);
  if (!existing) return next(ApiError.notFound(`No task with id "${req.params.id}".`));

  const { title, bed, done } = req.body;
  const patch = {};
  if (title !== undefined) patch.title = title;
  if (bed !== undefined) patch.bed = bed;
  if (done !== undefined) patch.done = done;

  const task = store.update(req.params.id, patch);
  res.status(200).json({ task });
}

/**
 * DELETE /api/tasks/:id
 */
function deleteTask(req, res, next) {
  const existing = store.getById(req.params.id);
  if (!existing) return next(ApiError.notFound(`No task with id "${req.params.id}".`));

  store.remove(req.params.id);
  res.status(204).send();
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
