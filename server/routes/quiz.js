import express from "express";
import pool from "../config/database.js";
import { requireAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM quiz");
    res.json(result.rows);

  } catch (error) {
    console.error(error);
  }
});

router.post('/', requireAdmin, async (req, res) => {
  const { question, answer } = req.body

  //값이 없을 때
  if (!question || !answer) {
    return res.status(400).json('데이터의 구조가 잘못 되었습니다.');
  }

  try {
    await pool.query('INSERT INTO quiz (question, answer) VALUES ($1,$2)', [question, answer]);
    // 성공시 응답
    res.status(201).json('전송 성공');
  }
  catch (err) {
    console.error(err)
    res.status(500).json('전송 실패');
  }
})

router.put('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json('데이터의 구조가 잘못 되었습니다.');
  }

  try {
    const result = await pool.query(
      'UPDATE quiz SET question = $1, answer = $2 WHERE id = $3',
      [question, answer, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json('데이터를 찾을 수 없습니다.');
    }

    return res.status(200).json('수정 성공');
  } catch (err) {
    console.error(err)
    return res.status(500).json('수정 실패');
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM quiz WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json('데이터를 찾을 수 없습니다.');
    }

    return res.status(200).json('삭제 성공');
  } catch (err) {
    console.error(err)
    return res.status(500).json('삭제 실패');
  }
});

router.post('/correct', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, msg: '로그인 필요' });
  }

  const { category, question, answer } = req.body;
  if (!category || !question || !answer) {
    return res.status(400).json({ success: false, msg: '데이터가 부족합니다.' });
  }

  try {
    await pool.query(
      "INSERT INTO user_correct_quiz (user_id, category, question, answer) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, category, question) DO NOTHING",
      [req.session.user.id, category, question, answer]
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('맞춘 퀴즈 저장 실패', err);
    return res.status(500).json({ success: false, msg: '서버 내부 에러' });
  }
});

router.get('/correct', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, msg: '로그인 필요' });
  }

  try {
    const result = await pool.query(
      "SELECT id, category, question, answer, created_at FROM user_correct_quiz WHERE user_id = $1 ORDER BY created_at DESC",
      [req.session.user.id]
    );
    return res.status(200).json({ success: true, items: result.rows });
  } catch (err) {
    console.error('맞춘 퀴즈 조회 실패', err);
    return res.status(500).json({ success: false, msg: '서버 내부 에러' });
  }
});

export default router;
