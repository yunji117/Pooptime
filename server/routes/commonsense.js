import express from 'express'
import pool from '../config/database.js'
import { requireAdmin } from "../middleware/authMiddleware.js";
const router = express.Router()

// get으로 조회
router.get('/',async(req,res)=>{
  try{
    const result = await pool.query("SELECT * FROM common_sense")
    res.json(result.rows)
  }
  catch(err){
    console.error(err)
    res.status(500).json({error:'데이터 조회 실패'})
  }
})

//post로 데이터 추가
router.post('/', requireAdmin, async(req,res)=>{
  const {question, answer} = req.body

  //값이 없을 때
  if(!question){
    return res.status(400).json({error:'값이 없음'})
  }

  try{
    await pool.query('INSERT INTO common_sense (question, answer) VALUES ($1,$2)',[question,answer])
    // 성공시 응답
    res.status(201).json({message:'데이터 추가 완료'})
  }
  catch(err){
    console.error(err)
    res.status(500).json({error:'데이터 추가 실패'})
  }
})

router.put('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: '값이 없음' })
  }

  try {
    const result = await pool.query(
      'UPDATE common_sense SET question = $1, answer = $2 WHERE id = $3',
      [question, answer, id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ error: '데이터를 찾을 수 없습니다.' })
    }

    return res.status(200).json({ message: '데이터 수정 완료' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: '데이터 수정 실패' })
  }
})

router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM common_sense WHERE id = $1', [id])

    if (result.rowCount === 0) {
      return res.status(404).json({ error: '데이터를 찾을 수 없습니다.' })
    }

    return res.status(200).json({ message: '데이터 삭제 완료' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: '데이터 삭제 실패' })
  }
})

export default router