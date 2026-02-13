import express from "express";
import pool from "../config/database.js";
const router = express.Router();

router.get("/check", async (req, res) => {
  if (req.session.user) {
    res.json({
      success: true,
      user: {
        id: req.session.user.id,
        user_nick: req.session.user.user_nick,
        user_email: req.session.user.user_email,
        is_admin: req.session.user.is_admin,
      },
    });
  } else{
    res.status(401).json({ success: false, msg: "로그인 필요" });
  }

})

router.get("/profile", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, msg: "로그인 필요" });
  }

  try {
    const result = await pool.query(
      "SELECT user_id, user_nick, email, created_at FROM users WHERE id = $1",
      [req.session.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, msg: "사용자 정보를 찾을 수 없습니다" });
    }

    return res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error("회원정보 조회 실패", err);
    return res.status(500).json({ success: false, msg: "서버 내부 에러" });
  }
});

export default router;