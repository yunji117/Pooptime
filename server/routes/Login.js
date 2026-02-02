//user_id,password

import express from 'express'
import pool from '../config/database.js'
import * as bcrypt from 'bcryptjs';
import session from "express-session";
const router = express.Router()

//모든 데이터조회
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT user_id,password FROM users')
    res.json(result.rows)
  }
  catch (err) {
    console.error(err)
  }
})

//특정데이터 조회 - user_id로 확인
router.get('/:user_id', async (req, res) => {
  const userId = req.params.user_id
  try {
    const result = await pool.query('SELECT user_id, password FROM users WHERE user_id = ? ', [userId])

    //존재하지 않을 때 - 빈 배열 반환
    if (result.rows.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없음' })
    }

    //존재하면 한 명만 조회됨
    res.json(result.rows[0])
  }
  catch (err) {
    console.error('DB user 조회 실패', err)
    res.status(500).json({ message: '서버 에러' })
  }
})

//로그인 요청 처리
router.post('/', async (req, res) => {
  const { id, user_id, password, autoLogin, } = req.body
  console.log(req.body);
  try {
    if (!user_id || !password) {
      return res.status(400).json({ success: false, message: '아이디와 비밀번호를 입력하세요' })
    }

    //조회
    const result = await pool.query('SELECT id, user_id, user_nick, email, password FROM users WHERE user_id = $1', [user_id]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: '사용자가 존재하지 않습니다' });
    }

    // 입력한 비밀번호와 DB의 암호화된 비밀번호 비교
    const isMatch = await bcrypt.compare(password, result.rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: '아이디 혹은 비밀번호가 일치하지 않습니다.' });
    } else {
      //응답 - 세션에 저장

      //자동로그인 체크에 따른 만료시간 연장
      if (autoLogin) {
        //3일
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 3
      } else {
        //1시간
        req.session.cookie.maxAge = 1000 * 60 * 60
      }

      console.log('기간확인', req.session.cookie.maxAge)

      req.session.user = {
        id: result.rows[0].id,
        user_id: result.rows[0].user_id,
        user_nick: result.rows[0].user_nick,
        user_email: result.rows[0].email,
      }
      console.log('세션 저장 확인', req.session.user)

      //성공 - 반환
      return res.json({ success: true, message: '로그인 성공', user: req.session.user })
    }
  }
  catch (err) {
    console.error('로그인 처리 중 오류', err)
    return res.status(500).json({ success: false, message: '서버오류' })
  }
})

export default router
