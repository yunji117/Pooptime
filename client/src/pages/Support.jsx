import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

function Support() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("send");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const userId = sessionStorage.getItem("id");

  useEffect(() => {
    if (!userId) {
      navigate("/Login");
    }
  }, [navigate, userId]);

  const fetchMyInquiries = async () => {
    setListLoading(true);
    try {
      const response = await fetch("http://localhost:8080/support/my", {
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
      console.error("문의 내역 조회 실패", err);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "history") {
      fetchMyInquiries();
    }
  }, [tab]);

  const submitInquiry = async () => {
    if (!message.trim()) {
      setError("문의 내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message: message.trim() }),
      });

      if (response.status === 401) {
        navigate("/Login");
        return;
      }

      const result = await response.json();
      if (result?.success) {
        setMessage("");
        setTab("history");
      } else {
        setError(result?.message || "문의 전송 실패");
      }
    } catch (err) {
      console.error("문의 전송 실패", err);
      setError("문의 전송 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <button type="button" onClick={() => navigate("/Quiz")}>
          <img src="../public/img/arrowLeft.svg" alt="뒤로가기" />
        </button>
      </div>
      <h2 className="text-lg font-semibold mb-4">고객센터</h2>
      <div className="flex gap-2 mb-6">
        <Button
          text="문의 보내기"
          colorClass={tab === "send" ? "bg-(--brand-600) text-white" : "bg-(--brand-100) text-(--brand-800)"}
          clickEvent={() => setTab("send")}
        />
        <Button
          text="내가 보낸 문의"
          colorClass={tab === "history" ? "bg-(--brand-600) text-white" : "bg-(--brand-100) text-(--brand-800)"}
          clickEvent={() => setTab("history")}
        />
      </div>

      {tab === "send" && (
        <div className="flex flex-col gap-3">
          <textarea
            className="w-full min-h-35 rounded-md border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-(--brand-200)"
            placeholder="문의 내용을 입력해주세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button
            text={loading ? "전송 중..." : "문의 보내기"}
            colorClass="bg-(--brand-600) text-white hover:bg-(--brand-700)"
            clickEvent={submitInquiry}
            disabled={loading}
          />
        </div>
      )}

      {tab === "history" && (
        <div className="flex flex-col gap-4">
          {listLoading ? (
            <p className="text-sm text-(--text-600)">불러오는 중...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-(--text-600)">보낸 문의가 없습니다.</p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-(--brand-100) p-3"
              >
                <div className="text-xs text-(--text-600) mb-2">
                  {new Date(item.created_at).toLocaleString()}
                </div>
                <p className="text-sm text-(--text-900) whitespace-pre-line">{item.message}</p>
                <div className="mt-3 rounded-md bg-(--surface-2) p-2">
                  <div className="text-xs text-(--text-600) mb-1">답변</div>
                  {item.reply ? (
                    <p className="text-sm text-(--text-900) whitespace-pre-line">{item.reply}</p>
                  ) : (
                    <p className="text-sm text-(--text-600)">답변 대기 중입니다.</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Support;
