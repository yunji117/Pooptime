import express from "express";
import pool from "../config/database.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM horror");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const {title, problem, answer} = req.body;
    if (!title || !problem || !answer) {
      return res.status(400).json('제목, 문제 혹은 답변이 잘못되어 있습니다.');
    }
    await pool.query('insert into horror (title, problem, answer) values ($1, $2, $3)', [title, problem, answer]);
    res.status(200);
    res.json('전송 성공');
  } catch (error) {
    res.status(500).json('전송 실패');
  }
})

export default router;