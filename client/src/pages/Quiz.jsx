import { useEffect, useState } from "react";

import QuizCard from "../components/QuizCard";
import QuizButton from "../components/QuizButton";
import { useLocation } from "react-router-dom";

function AllCategory() {
  const location = useLocation();
  const category = location.state?.category || "quiz"; // 기본값 설정
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
    <div className="w-full">
      <QuizCard quizData={data[num]} category={category} />
      <QuizButton nextBtn={() => nextBtn()} prevBtn={() => prevBtn()} data={data[num]} category={category} />
    </div>
  );
}

export default AllCategory;