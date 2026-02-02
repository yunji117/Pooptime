import express from 'express';
import pool from "../config/database.js";
const router = express.Router();



router.get("/post", async (req, res) => {
  try {
    const result = await pool.query("SELECT board.*, users.user_nick AS nickname FROM board LEFT JOIN users ON board.user_id = users.id ORDER BY date DESC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Community get error:", err);
    res.status(500).json({
      success: false,
      msg: "서버 내부 에러"
    });
  }
});

//특정 파일 조회
router.get('/post/:id', async (req, res) => {
  const id = req.params.id
  try {
    const result = await pool.query('SELECT board.*, users.user_nick AS nickname FROM board LEFT JOIN users ON board.user_id = users.id WHERE board_id=$1', [id])
    res.status(200).json(result.rows[0])
    console.log('데이터', result.rows[0]);
  }
  catch (err) {
    console.error("Community get error:", err);
    res.status(500).json({
      success: false,
      msg: "서버 내부 에러"
    });
  }
})

router.post('/write', async (req, res) => {
  const { title, content, user_id } = req.body;
  console.log("Community write attempt:", { user_id, title, content }); // 디버깅용 로그
  const strippedContent = content.replace(/<\/?p>/g, "");
  try {
    await pool.query(
      "INSERT INTO board(user_id, title, content) VALUES($1, $2, $3)",
      [user_id, title, strippedContent]
    );
    return res.status(200).json({ msg: "글 작성성공" });
  } catch (err) {
    console.error("Community write error:", err);
    res.status(500).json({
      success: false,
      msg: "서버 내부 에러"
    });
  }
});

//수정
router.put('/update/:id', async (req, res) => {
  //boarder_id
  const id = req.params.id
  const { title, content } = req.body

  //디버깅
  console.log('수정할 board_id', id)
  console.log('수정할 내용', req.body)

  try {
    await pool.query(`UPDATE board SET title = $1 ,content = $2 WHERE board_id=$3`, [title, content, id])
    return res.status(200).json({ msg: '글 수정 성공' })

  }
  catch (err) {
    console.log('err', err)
    res.status(500).json({
      success: false,
      msg: '서버 내부 에러'
    })
  }
})

//삭제
router.delete('/delete/:id', async (req, res) => {
  // board_id 가져오기
  const id = req.params.id

  //디버깅
  console.log('삭제할 board_id', id)

  try {
    await pool.query(`DELETE FROM board WHERE board_id=$1`, [id])
    return res.status(200).json({ msg: '글 삭제 성공' })
  }
  catch (err) {
    console.log('err', err)
    res.status(500).json({
      success: false,
      msg: '서버 내부 에러'
    })
  }
})

router.post('/view', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, msg: '로그인 필요' });
  }

  const { board_id } = req.body;
  if (!board_id) {
    return res.status(400).json({ success: false, msg: 'board_id가 필요합니다.' });
  }

  try {
    await pool.query(
      "INSERT INTO user_viewed_content (user_id, board_id, viewed_at) VALUES ($1, $2, NOW()) ON CONFLICT (user_id, board_id) DO UPDATE SET viewed_at = EXCLUDED.viewed_at",
      [req.session.user.id, board_id]
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('내가 본 컨텐츠 저장 실패', err);
    return res.status(500).json({ success: false, msg: '서버 내부 에러' });
  }
});

router.get('/viewed', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, msg: '로그인 필요' });
  }

  try {
    await pool.query(
      "DELETE FROM user_viewed_content WHERE user_id = $1 AND viewed_at < NOW() - INTERVAL '30 days'",
      [req.session.user.id]
    );

    const result = await pool.query(
      `SELECT uvc.id, uvc.viewed_at, b.board_id, b.title, b.date
       FROM user_viewed_content AS uvc
       JOIN board AS b ON uvc.board_id = b.board_id
       WHERE uvc.user_id = $1
       ORDER BY uvc.viewed_at DESC`,
      [req.session.user.id]
    );

    return res.status(200).json({ success: true, items: result.rows });
  } catch (err) {
    console.error('내가 본 컨텐츠 조회 실패', err);
    return res.status(500).json({ success: false, msg: '서버 내부 에러' });
  }
});

router.delete('/viewed/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, msg: '로그인 필요' });
  }

  const { id } = req.params;
  try {
    await pool.query(
      "DELETE FROM user_viewed_content WHERE id = $1 AND user_id = $2",
      [id, req.session.user.id]
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('내가 본 컨텐츠 삭제 실패', err);
    return res.status(500).json({ success: false, msg: '서버 내부 에러' });
  }
});

// 추천 추가
router.post('/recommend', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, msg: '로그인 필요' });
  }

  const { board_id } = req.body;
  if (!board_id) {
    return res.status(400).json({ success: false, msg: 'board_id가 필요합니다.' });
  }

  try {
    await pool.query(
      "INSERT INTO user_recommend (user_id, board_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT (user_id, board_id) DO NOTHING",
      [req.session.user.id, board_id]
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('추천 추가 실패', err);
    return res.status(500).json({ success: false, msg: '서버 내부 에러' });
  }
});

// 추천 취소
router.delete('/recommend/:boardId', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, msg: '로그인 필요' });
  }

  const { boardId } = req.params;
  try {
    await pool.query(
      "DELETE FROM user_recommend WHERE user_id = $1 AND board_id = $2",
      [req.session.user.id, boardId]
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('추천 취소 실패', err);
    return res.status(500).json({ success: false, msg: '서버 내부 에러' });
  }
});

// 추천 수 조회
router.get('/:boardId/recommend-count', async (req, res) => {
  const { boardId } = req.params;
  try {
    const result = await pool.query(
      "SELECT COUNT(*) as count FROM user_recommend WHERE board_id = $1",
      [boardId]
    );
    return res.status(200).json({ success: true, count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error('추천 수 조회 실패', err);
    return res.status(500).json({ success: false, msg: '서버 내부 에러' });
  }
});

// 사용자의 추천 여부 확인
router.get('/:boardId/recommend-status', async (req, res) => {
  if (!req.session.user) {
    return res.status(200).json({ success: true, isRecommended: false });
  }

  const { boardId } = req.params;
  try {
    const result = await pool.query(
      "SELECT id FROM user_recommend WHERE user_id = $1 AND board_id = $2",
      [req.session.user.id, boardId]
    );
    return res.status(200).json({ success: true, isRecommended: result.rows.length > 0 });
  } catch (err) {
    console.error('추천 여부 확인 실패', err);
    return res.status(500).json({ success: false, msg: '서버 내부 에러' });
  }
});

// 즐찾 추가
router.post('/favorite', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, msg: '로그인 필요' });
  }

  const { board_id } = req.body;
  if (!board_id) {
    return res.status(400).json({ success: false, msg: 'board_id가 필요합니다.' });
  }

  try {
    await pool.query(
      "INSERT INTO user_favorite (user_id, board_id, created_at) VALUES ($1, $2, NOW())",
      [req.session.user.id, board_id]
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('즐찾 추가 실패', err);
    return res.status(500).json({ success: false, msg: '서버 내부 에러' });
  }
});

// 즐찾 삭제
router.delete('/favorite/:boardId', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, msg: '로그인 필요' });
  }

  const { boardId } = req.params;
  try {
    await pool.query(
      "DELETE FROM user_favorite WHERE user_id = $1 AND board_id = $2",
      [req.session.user.id, boardId]
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('즐찾 삭제 실패', err);
    return res.status(500).json({ success: false, msg: '서버 내부 에러' });
  }
});

// 사용자의 즐찾 여부 확인
router.get('/:boardId/favorite-status', async (req, res) => {
  if (!req.session.user) {
    return res.status(200).json({ success: true, isFavorited: false });
  }

  const { boardId } = req.params;
  try {
    const result = await pool.query(
      "SELECT id FROM user_favorite WHERE user_id = $1 AND board_id = $2",
      [req.session.user.id, boardId]
    );
    return res.status(200).json({ success: true, isFavorited: result.rows.length > 0 });
  } catch (err) {
    console.error('즐찾 여부 확인 실패', err);
    return res.status(500).json({ success: false, msg: '서버 내부 에러' });
  }
});

// 사용자의 즐찾 목록 조회
router.get('/user/favorites', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, msg: '로그인 필요' });
  }

  try {
    const result = await pool.query(
      `SELECT uf.id, uf.created_at, b.board_id, b.title, b.date, u.user_nick as nickname
       FROM user_favorite AS uf
       JOIN board AS b ON uf.board_id = b.board_id
       JOIN users AS u ON b.user_id = u.id
       WHERE uf.user_id = $1
       ORDER BY uf.created_at DESC`,
      [req.session.user.id]
    );

    return res.status(200).json({ success: true, items: result.rows });
  } catch (err) {
    console.error('즐찾 목록 조회 실패', err);
    return res.status(500).json({ success: false, msg: '서버 내부 에러' });
  }
});

// 사용자의 추천 목록 조회
router.get('/user/recommends', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, msg: '로그인 필요' });
  }

  try {
    const result = await pool.query(
      `SELECT ur.id, ur.created_at, b.board_id, b.title, b.date, u.user_nick as nickname
       FROM user_recommend AS ur
       JOIN board AS b ON ur.board_id = b.board_id
       JOIN users AS u ON b.user_id = u.id
       WHERE ur.user_id = $1
       ORDER BY ur.created_at DESC`,
      [req.session.user.id]
    );

    return res.status(200).json({ success: true, items: result.rows });
  } catch (err) {
    console.error('추천 목록 조회 실패', err);
    return res.status(500).json({ success: false, msg: '서버 내부 에러' });
  }
});

export default router;