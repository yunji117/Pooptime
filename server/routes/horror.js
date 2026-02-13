import express from "express";
import pool from "../config/database.js";
import { requireAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM horror");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
  }
});

router.post('/', requireAdmin, async (req, res) => {
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

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, problem, answer } = req.body;
    if (!title || !problem || !answer) {
      return res.status(400).json('제목, 문제 혹은 답변이 잘못되어 있습니다.');
    }

    const result = await pool.query(
      'UPDATE horror SET title = $1, problem = $2, answer = $3 WHERE id = $4',
      [title, problem, answer, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json('데이터를 찾을 수 없습니다.');
    }

    res.status(200).json('수정 성공');
  } catch (error) {
    res.status(500).json('수정 실패');
  }
})

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM horror WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json('데이터를 찾을 수 없습니다.');
    }

    res.status(200).json('삭제 성공');
  } catch (error) {
    res.status(500).json('삭제 실패');
  }
})

export default router;