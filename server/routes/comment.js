import express from "express";
import pool from "../config/database.js";

const router = express.Router();

router.get("/:board_id", async (req, res) => {
  const { board_id } = req.params;
  console.log("댓글 요청", { board_id }); // 디버깅용 로그

  try {
    const result = await pool.query(`
      SELECT c.comment_id AS id, c.content, c.date, u.user_nick, u.user_id
      FROM comment AS c
      JOIN users AS u ON c.user_id = u.id
      WHERE c.board_id = $1
      ORDER BY c.date desc
    `, [board_id]);

    res.status(200).json(result.rows);
    console.log("댓글 데이터", result.rows); // 디버깅용 로그
  } catch (err) {
    console.error("댓글 조회 실패", err);
    res.status(500).json({
      success: false,
      msg: "서버 내부 에러",
    });
  }
});

router.post("/write", async (req, res) => {
  const { content, user_id, board_id } = req.body;
  console.log("작성 요청:", { user_id, content, board_id }); // 디버깅용 로그

  try {
    // 댓글 저장 (한국 시간 기준)
    const kstDate = new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString();
    await pool.query(
      "INSERT INTO comment(content, user_id, board_id, date) VALUES($1, $2, $3, $4)",
      [content, user_id, board_id, kstDate]
    );
    return res.status(200).json({ msg: "댓글 작성 성공" });
  } catch (err) {
    console.error("댓글 작성 실패:", err);
    res.status(500).json({
      success: false,
      msg: "서버 내부 에러",
    });
  }
});
export default router;
