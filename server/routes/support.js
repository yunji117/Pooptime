import express from "express";
import nodemailer from "nodemailer";
import pool from "../config/database.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const adminEmail = process.env.SUPPORT_ADMIN_EMAIL || "yunw0117@gmail.com";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PW,
  },
});

const requireLogin = (req, res, next) => {
  if (!req.session?.user) {
    return res.status(401).json({ success: false, message: "로그인 필요" });
  }
  return next();
};


router.post("/", requireLogin, async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: "문의 내용을 입력해주세요." });
  }

  try {
    const user = req.session.user;
    const result = await pool.query(
      "INSERT INTO support_inquiry (user_id, user_email, message) VALUES ($1, $2, $3) RETURNING id, created_at",
      [user.id, user.user_email || "", message.trim()]
    );

    let mailSent = true;
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_ID,
        to: adminEmail,
        subject: `[문의] ${user.user_nick} (${user.user_id})`,
        text: `사용자 아이디: ${user.user_id}\n닉네임: ${user.user_nick}\n이메일: ${user.user_email || ""}\n\n문의 내용:\n${message.trim()}`,
      });
    } catch (error) {
      mailSent = false;
      console.error("문의 메일 전송 실패", error);
    }

    return res.status(201).json({
      success: true,
      mailSent,
      item: result.rows[0],
    });
  } catch (error) {
    console.error("문의 저장 실패", error);
    return res.status(500).json({ success: false, message: "문의 저장 실패" });
  }
});

router.get("/my", requireLogin, async (req, res) => {
  try {
    const user = req.session.user;
    const result = await pool.query(
      "SELECT id, message, created_at, reply, replied_at FROM support_inquiry WHERE user_id = $1 ORDER BY created_at DESC",
      [user.id]
    );
    return res.status(200).json({ success: true, items: result.rows });
  } catch (error) {
    console.error("문의 내역 조회 실패", error);
    return res.status(500).json({ success: false, message: "문의 내역 조회 실패" });
  }
});

router.get("/admin", requireLogin, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT s.id, s.message, s.created_at, s.reply, s.replied_at, u.user_id, u.user_nick, u.email FROM support_inquiry s JOIN users u ON s.user_id = u.id ORDER BY s.created_at DESC"
    );
    return res.status(200).json({ success: true, items: result.rows });
  } catch (error) {
    console.error("관리자 문의 조회 실패", error);
    return res.status(500).json({ success: false, message: "관리자 문의 조회 실패" });
  }
});

router.post("/:id/reply", requireLogin, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  if (!reply || !reply.trim()) {
    return res.status(400).json({ success: false, message: "답변 내용을 입력해주세요." });
  }

  try {
    const updateResult = await pool.query(
      "UPDATE support_inquiry SET reply = $1, replied_at = NOW() WHERE id = $2 RETURNING user_email, message",
      [reply.trim(), id]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "문의 내역을 찾을 수 없습니다." });
    }

    const target = updateResult.rows[0];
    let mailSent = true;
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_ID,
        to: target.user_email,
        subject: "[Pooptime] 문의 답변 안내",
        text: `문의 내용:\n${target.message}\n\n답변:\n${reply.trim()}`,
      });
    } catch (error) {
      mailSent = false;
      console.error("답변 메일 전송 실패", error);
    }

    return res.status(200).json({ success: true, mailSent });
  } catch (error) {
    console.error("답변 저장 실패", error);
    return res.status(500).json({ success: false, message: "답변 저장 실패" });
  }
});

export default router;
