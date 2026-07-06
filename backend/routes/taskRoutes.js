import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
// ================= CREATE TASK =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const text = (req.body.text || "").trim();
    const category = req.body.category || "Study";
    const repeat = req.body.repeat || "Daily";
    const dueDate = req.body.dueDate || "";
    if (!text) {
      return res.status(400).json({
        error: "Task text is required."
      });
    }
    // ✅ FIXED: duplicate check now user-specific
    const existingTask = await Task.findOne({
      user: req.user.id,
      text: { $regex: new RegExp(`^${text}$`, "i") },
      category,
      repeat
    });
    if (existingTask) {
      return res.status(400).json({
        error: "Task already exists."
      });
    }
    const newTask = new Task({
      text,
      dueDate,
      category,
      repeat,
      user: req.user.id
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
// ================= GET ALL TASKS =================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
// ================= UPDATE TASK =================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const text = (req.body.text || "").trim();
    const category = req.body.category || "Study";
    const repeat = req.body.repeat || "Daily";
    const dueDate = req.body.dueDate || "";
    // ✅ FIXED duplicate check (user-safe)
    const duplicateTask = await Task.findOne({
      _id: { $ne: req.params.id },
      user: req.user.id,
      text: { $regex: new RegExp(`^${text}$`, "i") },
      category,
      repeat
    });
    if (duplicateTask) {
      return res.status(400).json({
        error: "Task already exists."
      });
    }
    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      {
        text,
        dueDate,
        category,
        repeat
      },
      {
        new: true
      }
    );
    if (!updatedTask) {
      return res.status(404).json({
        error: "Task not found."
      });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
// ================= DELETE TASK =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!deletedTask) {
      return res.status(404).json({
        error: "Task not found."
      });
    }
    res.json({
      message: "Task deleted"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
// ================= TOGGLE COMPLETE =================
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    if (!task) {
      return res.status(404).json({
        error: "Task not found."
      });
    }
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
export default router;