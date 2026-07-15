const crypto = require("crypto");

/**
 * In-memory "store" for tasks.
 *
 * Project 2's brief is deliberately about the API layer, not persistence —
 * "before you scale into complex databases, master the art of building
 * robust endpoints." This module is written so that swapping it for a real
 * database later only means changing the functions below; nothing in the
 * routes or controllers needs to change.
 */

const BEDS = Object.freeze(["deep-work", "admin", "learning"]);

let tasks = [
  { id: makeId(), title: "Sketch the low-fidelity wireframe", bed: "deep-work", done: true, createdAt: new Date().toISOString() },
  { id: makeId(), title: "Pick the type pairing", bed: "learning", done: true, createdAt: new Date().toISOString() },
  { id: makeId(), title: "Design the /tasks endpoints", bed: "deep-work", done: false, createdAt: new Date().toISOString() },
  { id: makeId(), title: "Write request validation middleware", bed: "deep-work", done: false, createdAt: new Date().toISOString() },
  { id: makeId(), title: "Document the API in the README", bed: "admin", done: false, createdAt: new Date().toISOString() },
  { id: makeId(), title: "Read up on REST naming conventions", bed: "learning", done: false, createdAt: new Date().toISOString() },
];

function makeId() {
  return "t_" + crypto.randomBytes(5).toString("hex");
}

function getAll({ bed, done } = {}) {
  let result = tasks;
  if (bed) result = result.filter((t) => t.bed === bed);
  if (done !== undefined) result = result.filter((t) => t.done === done);
  return result;
}

function getById(id) {
  return tasks.find((t) => t.id === id) || null;
}

function create({ title, bed }) {
  const task = {
    id: makeId(),
    title,
    bed,
    done: false,
    createdAt: new Date().toISOString(),
  };
  tasks.unshift(task);
  return task;
}

function update(id, patch) {
  const task = getById(id);
  if (!task) return null;
  Object.assign(task, patch);
  return task;
}

function remove(id) {
  const before = tasks.length;
  tasks = tasks.filter((t) => t.id !== id);
  return tasks.length < before;
}

module.exports = { BEDS, getAll, getById, create, update, remove };
