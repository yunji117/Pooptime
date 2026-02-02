import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const categoryLabel = {
  quiz: "유머",
  knowledge: "상식",
};

function MyCorrectQuiz() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchCorrect = async () => {
      try {
        const response = await fetch("http://localhost:8080/quiz/correct", {
          credentials: "include",
        });

        if (response.status === 401) {
          navigate("/Login");
          return;
        }

        const result = await response.json();
        if (result?.success) {
          setItems(result.items || []);
        }
      } catch (err) {
        console.error("맞춘 퀴즈 조회 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCorrect();
  }, [navigate]);

  return (
    <div className="w-full">
      <div className="mb-4">
        <button type="button" onClick={() => navigate(-1)}>
          <img src="../public/img/arrowLeft.svg" alt="뒤로가기" />
        </button>
      </div>
      <div className="flex items-center pb-3 mb-5">
        <img className="w-10" src="../public/img/poopNameImg.svg" alt="프로필" />
        <div className="ml-4">
          <h4 className="text-base font-semibold text-(--text-900)">내가 맞춘 퀴즈</h4>
          <p className="text-xs text-(--text-600)">정답 처리된 퀴즈만 저장됩니다.</p>
        </div>
      </div>

      <div className="bg-(--surface-0) rounded-xl p-4 shadow-[0_0_5px_0_rgba(0,0,0,0.08)]">
        {loading ? (
          <p className="text-sm text-(--text-600)">불러오는 중...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-(--text-600)">맞춘 퀴즈가 없습니다.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-(--brand-100) p-3"
              >
                <div className="text-xs text-(--text-600) mb-1">
                  {categoryLabel[item.category] || item.category}
                </div>
                <div className="text-sm font-semibold text-(--text-900)">{item.question}</div>
                <div className="text-xs text-(--text-600) mt-2">정답: {item.answer}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCorrectQuiz;
