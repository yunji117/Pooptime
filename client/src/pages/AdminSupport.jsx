import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

function AdminSupport() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [replyDrafts, setReplyDrafts] = useState({});

  const fetchInquiries = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8080/support/admin", {
        credentials: "include",
      });

      if (response.status === 401) {
        navigate("/Login");
        return;
      }

      if (response.status === 403) {
        setError("관리자 권한이 필요합니다.");
        setItems([]);
        return;
      }

      const result = await response.json();
      if (result?.success) {
        setItems(result.items || []);
      } else {
        setError(result?.message || "문의 내역 조회 실패");
      }
    } catch (err) {
      console.error("관리자 문의 조회 실패", err);
      setError("문의 내역 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const submitReply = async (id) => {
    const reply = replyDrafts[id];
    if (!reply || !reply.trim()) {
      setError("답변 내용을 입력해주세요.");
      return;
    }

    setError("");
    try {
      const response = await fetch(`http://localhost:8080/support/${id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ reply: reply.trim() }),
      });

      if (response.status === 401) {
        navigate("/Login");
        return;
      }

      if (response.status === 403) {
        setError("관리자 권한이 필요합니다.");
        return;
      }

      const result = await response.json();
      if (result?.success) {
        setReplyDrafts((prev) => ({ ...prev, [id]: "" }));
        fetchInquiries();
      } else {
        setError(result?.message || "답변 전송 실패");
      }
    } catch (err) {
      console.error("답변 전송 실패", err);
      setError("답변 전송 실패");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">관리자 고객센터</h2>
      <div className="flex flex-col gap-2 mb-6">
        <Button
          text="문의 새로고침"
          colorClass="bg-(--brand-100) text-(--brand-800)"
          clickEvent={fetchInquiries}
        />
      </div>

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      {loading ? (
        <p className="text-sm text-(--text-600)">불러오는 중...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-(--text-600)">문의 내역이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-lg border border-(--brand-100) p-3">
              <div className="text-xs text-(--text-600) mb-2">
                {new Date(item.created_at).toLocaleString()}
              </div>
              <div className="text-sm text-(--text-900) mb-2">
                {item.user_nick} ({item.user_id}) - {item.email}
              </div>
              <p className="text-sm text-(--text-900) whitespace-pre-line">{item.message}</p>
              {item.reply ? (
                <div className="mt-3 rounded-md bg-(--surface-2) p-2">
                  <div className="text-xs text-(--text-600) mb-1">답변 완료</div>
                  <p className="text-sm text-(--text-900) whitespace-pre-line">{item.reply}</p>
                </div>
              ) : (
                <div className="mt-3 flex flex-col gap-2">
                  <textarea
                    className="w-full min-h-[90px] rounded-md border border-gray-200 p-2"
                    placeholder="답변 내용을 입력하세요"
                    value={replyDrafts[item.id] || ""}
                    onChange={(e) =>
                      setReplyDrafts((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                  />
                  <Button
                    text="답변 보내기"
                    colorClass="bg-(--brand-600) text-white"
                    clickEvent={() => submitReply(item.id)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminSupport;
