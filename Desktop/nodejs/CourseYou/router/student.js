import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// initialize router
const router = express.Router();

// get file & directory name (ESM way)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// path to JSON file
const dataFilePath = path.join(__dirname, "../data/student.json");

/* =========================
   Helper Functions
========================= */

// Get all students
async function getAllStudents() {
  try {
    const data = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return []; // if file empty or not found
  }
}

// Write students to file
async function writeStudents(students) {
  await fs.writeFile(
    dataFilePath,
    JSON.stringify(students, null, 2),
    "utf-8"
  );
}

/* =========================
   Routes
========================= */

// GET all students
router.get("/", async (req, res) => {
  try {
    const students = await getAllStudents();
    res.status(200).json({
      message: "Successfully fetched all students",
      students
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error occurred"
    });
  }
});

// POST create new student
router.post("/", async (req, res) => {
  try {
    
    const { name, age, grade, department } = req.body;

    // validation
    if (!name || !age ) {
      return res.status(400).json({
        message: "Please provide all required fields"
      });
    }

    const students = await getAllStudents();

    // generate new ID
    const newId =
      students.length > 0
        ? Math.max(...students.map(s => Number(s.id))) + 1
        : 1;

    const newStudent = {
      id: newId.toString(),
      name,
      age: Number(age),
      grade,
      department
    };

    students.push(newStudent);
    await writeStudents(students);

    res.status(201).json({
      message: "Student created successfully",
      student: newStudent
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error occurred"
    });
  }
});

export default router;
