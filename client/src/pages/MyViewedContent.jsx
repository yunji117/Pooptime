import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyViewedContent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const fetchViewed = async () => {
    try {
      const response = await fetch("http://localhost:8080/community/viewed", {
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
      console.error("내가 본 컨텐츠 조회 실패", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViewed();
  }, []);

  const removeItem = async (id) => {
    try {
      await fetch(`http://localhost:8080/community/viewed/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("기록 삭제 실패", err);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <button type="button" onClick={() => navigate(-1)}>
          <img src="../public/img/arrowLeft.svg" alt="뒤로가기" />
        </button>
      </div>
      <div className="flex items-center pb-3 mb-2">
        <img className="w-10" src="../public/img/poopNameImg.svg" alt="프로필" />
        <div className="ml-4">
          <h4 className="text-base font-semibold text-(--text-900)">내가 본 컨텐츠</h4>
          <p className="text-xs text-(--text-600)">한달이 지난 내가 본 컨텐츠는 자동으로 삭제됩니다.</p>
        </div>
      </div>

      <div className="bg-(--surface-0) rounded-xl p-4 shadow-[0_0_5px_0_rgba(0,0,0,0.08)]">
        {loading ? (
          <p className="text-sm text-(--text-600)">불러오는 중...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-(--text-600)">내가 본 컨텐츠가 없습니다.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-(--brand-100) p-3"
              >
                <button
                  type="button"
                  onClick={() => navigate(`/Community/CommunityDetail/${item.board_id}`)}
                  className="flex-1 text-left"
                >
                  <div className="text-sm font-semibold text-(--text-900)">{item.title}</div>
                  <div className="text-xs text-(--text-600)">
                    {item.date ? String(item.date).split("T")[0].replace(/-/g, ".") : ""}
                  </div>
                </button>
                <button
                  type="button"
                  className="text-xs text-(--brand-700) hover:text-(--brand-900)"
                  onClick={() => removeItem(item.id)}
                >
                  기록삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyViewedContent;
