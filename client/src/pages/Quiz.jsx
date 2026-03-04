import { useEffect, useState } from "react";

import QuizCard from "../components/QuizCard";
import QuizButton from "../components/QuizButton";
import { useLocation } from "react-router-dom";

function AllCategory() {
  const location = useLocation();
  const category = location.state?.category || "quiz"; // 기본값 설정
  const isHorror = category === "horror";
  const [data, setData] = useState([]);
  const [num, setNum] = useState(Number(localStorage.getItem(`${category}Num`)) || 0);

  //로컬스토리지 - num이 변할 때마다 데이터 저장
  useEffect(() => {
    localStorage.setItem(`${category}Num`, num.toString())
  }, [num])

  useEffect(() => {
    setNum(Number(localStorage.getItem(`${category}Num`)));
  }, [category]);

  //fetch 가져오기
  useEffect(() => {
    fetch(`http://localhost:8080/${category}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })

  }, [category])

  //버튼 이벤트
  const prevBtn = () => {
    if (num > 0) {
      setNum(num - 1);
    }
  }
  const nextBtn = () => {
    if (num < data.length - 1) {
      setNum(num + 1);
    }
  }

  //정답확인


  return (
    <div className={`w-full max-w-3xl px-4 ${isHorror ? "pb-20 -mt-4" : ""}`}>
      <div className={isHorror ? "flex min-h-[calc(100vh-9.5rem)] flex-col gap-4" : "w-full"}>
        <div className={isHorror ? "flex-1 min-h-0" : ""}>
          <QuizCard
            quizData={data[num]}
            category={category}
            className={isHorror ? "h-full min-h-72 max-h-[calc(100vh-10rem)] overflow-y-auto pb-24" : ""}
          />
        </div>
        <div className={isHorror ? "sticky bottom-30 z-10 rounded-2xl border border-(--brand-100) bg-(--surface-0)/95 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur" : "mt-6"}>
          <QuizButton
            nextBtn={() => nextBtn()}
            prevBtn={() => prevBtn()}
            data={data[num]}
            category={category}
            isLast={num >= data.length - 1}
          />
        </div>
      </div>
    </div>
  );
}

export default AllCategory;
