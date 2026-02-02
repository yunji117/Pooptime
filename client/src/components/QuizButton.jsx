import { useState, useRef, useEffect } from "react";
import QuizControl from "./QuizControl";
import ToastPopup from "./ToastPopup";
import DetailModal from "./DetailModal";

function QuizButton({ nextBtn, prevBtn, data, category = 'quiz', isLast = false }) {
  //정답인지 아닌지
  const [isAnswer, setIsAnswer] = useState(false);
  const [btnText, setBtnText] = useState('정답확인');
  const inputRef = useRef(null);

  //팝업 보여줄지
  const [isShow, setIsShow] = useState(false)
  //팝업 메시지
  const [toastText, setToastText] = useState('')
  //팝업 텍스트 색상
  const [textColor, setTextColor] = useState(null)
  //정답 모달
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {

    if (isShow) {
      const show = setTimeout(() => {
        setIsShow(false)
      }, 1500)

      return () => clearTimeout(show)

    }

  }, [isShow])

  //정답확인 버튼 -> !answer 값 들어가게도록

  useEffect(() => {
    if (isAnswer) {
      setBtnText(data?.answer || '');
      return
    } else {
      setBtnText('정답확인');
    }

  }, [isAnswer])

  // 카테고리가 변경될 때 정답 초기화
  useEffect(() => {
    setIsAnswer(false);
  }, [category]);

  //정답 제출 버튼
  const checkAnswer = () => {
    const userAnswer = inputRef.current.value.trim()

    if (userAnswer === data.answer) {
      inputRef.current.value = ''
      setIsAnswer(false)
      fetch("http://localhost:8080/quiz/correct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          category,
          question: data?.question || "",
          answer: data?.answer || "",
        }),
      }).catch(console.error)
      setIsModalOpen(true)
    } else {

      //팝업
      setIsShow(true)
      setToastText('오답입니다')
      setTextColor('text-red-500')
    }
  }

  return (
    <div className="flex flex-col gap-5 text-center">
      <DetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-4 text-center min-w-64">
          <div className="text-lg font-semibold text-blue-500">정답입니다.</div>
          {isLast && (
            <div className="text-sm text-(--text-600)">마지막 문제 입니다.</div>
          )}
          <div className="text-base font-bold text-(--text-900)">{data?.answer}</div>
          <div className="flex gap-4 mt-2 w-full">
            <button
              type="button"
              className="flex-1 min-w-28 rounded-md bg-(--brand-100) text-(--brand-800) px-4 py-2 text-sm hover:bg-(--brand-200)"
              onClick={() => {
                setIsModalOpen(false)
                prevBtn()
              }}
            >
              이전 문제
            </button>
            <button
              type="button"
              className="flex-1 min-w-28 rounded-md bg-(--brand-600) text-white px-4 py-2 text-sm hover:bg-(--brand-700)"
              onClick={() => {
                setIsModalOpen(false)
                nextBtn()
              }}
            >
              다음 문제
            </button>
          </div>
        </div>
      </DetailModal>
      <div className={(category === "knowledge") || (category === "quiz") ? "" : "hidden"}>
        {/* 팝업 */}
        <ToastPopup text={toastText} isShow={isShow} textColor={textColor} />
        {/* 정답 작성 및 확인 */}
        <div className="w-full flex border border-[#D9D9D9]/70">
          <input
            className="w-full outline-none p-2"
            type="text"
            placeholder="정답을 입력해주세요."
            ref={inputRef}
          />
          {/* 확인버튼 누르면 정답 일치하는지 확인 */}
          <button
            className="bg-[#8E5E43] border-[#8E5E43] p-2 rounded-[0px_3px_3px_0px] text-white whitespace-nowrap cursor-pointer"
            onClick={() => checkAnswer()}>확인</button>
        </div>
      </div>
      {/* 정답보기 */}
      <QuizControl btnText={btnText} answerBtn={() => setIsAnswer(!isAnswer)}
        prevBtn={() => {
          inputRef.current.value = ''
          setIsAnswer(false)
          prevBtn()
        }}
        nextBtn={() => {
          inputRef.current.value = ''
          setIsAnswer(false)
          nextBtn()
        }} />
    </div>
  )
}

export default QuizButton;