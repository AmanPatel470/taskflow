const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Get tasks for user
router.get("/:userId", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add new task
router.post("/", async (req, res) => {
  try {
    const { userId, text } = req.body;
    const newTask = new Task({ userId, text });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete task
router.delete("/:taskId", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update task completion
router.patch("/:taskId", async (req, res) => {
  try {
    const { completed } = req.body;
    await Task.findByIdAndUpdate(req.params.taskId, { completed });
    res.json({ message: "Task updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Edit task text
router.patch("/edit/:taskId", async (req, res) => {
  try {
    const { text } = req.body;
    await Task.findByIdAndUpdate(req.params.taskId, { text });
    res.json({ message: "Task text updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
