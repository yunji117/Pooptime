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

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const countWords = (value) =>
    value
      .trim()
      .split(/\s+/)
      .filter(Boolean).length

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
    clearInput();
  }, [category]);

  //정답 제출 버튼
  const checkAnswer = () => {
    const userAnswer = inputRef.current?.value?.trim() || ''
    const isHorror = category === "horror"
    const isCorrect = isHorror
      ? countWords(userAnswer) >= 5
      : userAnswer === data.answer

    if (!userAnswer) {
      setIsShow(true)
      setToastText(isHorror ? '답변을 입력해주세요' : '정답을 입력해주세요')
      setTextColor('text-red-500')
      return
    }

    if (isCorrect) {
      clearInput()
      setIsAnswer(false)
      fetch("http://localhost:8080/quiz/correct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          category,
          question: isHorror
            ? data?.title || data?.problem || ""
            : data?.question || "",
          answer: data?.answer || "",
        }),
      }).catch(console.error)
      setIsModalOpen(true)
    } else {
      setIsShow(true)
      setToastText(isHorror ? '괴담 답변은 5단어 이상 입력해주세요' : '오답입니다')
      setTextColor('text-red-500')
    }
  }

  return (
    <div className="flex flex-col gap-5 text-center">
      <DetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-4 text-center min-w-64">
          <div className="text-lg font-semibold text-blue-500">
            {category === "horror" ? "정답 처리되었습니다." : "정답입니다."}
          </div>
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
                clearInput()
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
                clearInput()
                nextBtn()
              }}
            >
              다음 문제
            </button>
          </div>
        </div>
      </DetailModal>
      <ToastPopup text={toastText} isShow={isShow} textColor={textColor} />
      <div className="w-full flex border border-[#D9D9D9]/70 rounded-md overflow-hidden">
        {category === "horror" ? (
          <textarea
            className="w-full outline-none p-3 min-h-28 resize-none"
            placeholder="괴담 문제의 해답을 5단어 이상으로 입력해주세요."
            ref={inputRef}
          />
        ) : (
          <input
            className="w-full outline-none p-2"
            type="text"
            placeholder="정답을 입력해주세요."
            ref={inputRef}
          />
        )}
        <button
          className="bg-[#8E5E43] border-[#8E5E43] px-4 py-2 text-white whitespace-nowrap cursor-pointer self-stretch"
          onClick={() => checkAnswer()}
        >
          확인
        </button>
      </div>
      {/* 정답보기 */}
      <QuizControl btnText={btnText} answerBtn={() => setIsAnswer(!isAnswer)}
        prevBtn={() => {
          clearInput()
          setIsAnswer(false)
          prevBtn()
        }}
        nextBtn={() => {
          clearInput()
          setIsAnswer(false)
          nextBtn()
        }} />
    </div>
  )
}

export default QuizButton;
