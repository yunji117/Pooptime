import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const tabs = [
  { key: "quiz", label: "퀴즈" },
  { key: "knowledge", label: "상식" },
  { key: "horror", label: "호러" },
];

const endpoints = {
  quiz: "http://localhost:8080/quiz",
  knowledge: "http://localhost:8080/knowledge",
  horror: "http://localhost:8080/horror",
};

function AdminQuiz() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("quiz");
  const [view, setView] = useState("list");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    question: "",
    answer: "",
    title: "",
    problem: "",
  });

  const [drafts, setDrafts] = useState({});

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(endpoints[tab]);
      if (!response.ok) {
        setError("목록을 불러오지 못했습니다.");
        setItems([]);
        return;
      }
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
      setDrafts({});
    } catch (err) {
      console.error("목록 조회 실패", err);
      setError("목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [tab]);

  const resetForm = () => {
    setForm({ question: "", answer: "", title: "", problem: "" });
  };

  const createItem = async () => {
    setError("");
    try {
      const payload =
        tab === "horror"
          ? { title: form.title, problem: form.problem, answer: form.answer }
          : { question: form.question, answer: form.answer };

      const response = await fetch(endpoints[tab], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.status === 401 || response.status === 403) {
        navigate("/Admin/login");
        return;
      }

      if (!response.ok) {
        setError("등록에 실패했습니다.");
        return;
      }

      resetForm();
      fetchItems();
    } catch (err) {
      console.error("등록 실패", err);
      setError("등록에 실패했습니다.");
    }
  };

  const handleCreateSuccess = async () => {
    await createItem();
    if (!error) {
      setView("list");
    }
  };

  const updateItem = async (itemId) => {
    setError("");
    const draft = drafts[itemId];
    if (!draft) {
      return;
    }

    try {
      const response = await fetch(`${endpoints[tab]}/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(draft),
      });

      if (response.status === 401 || response.status === 403) {
        navigate("/Admin/login");
        return;
      }

      if (!response.ok) {
        setError("수정에 실패했습니다.");
        return;
      }

      fetchItems();
    } catch (err) {
      console.error("수정 실패", err);
      setError("수정에 실패했습니다.");
    }
  };

  const deleteItem = async (itemId) => {
    setError("");
    try {
      const response = await fetch(`${endpoints[tab]}/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.status === 401 || response.status === 403) {
        navigate("/Admin/login");
        return;
      }

      if (!response.ok) {
        setError("삭제에 실패했습니다.");
        return;
      }

      fetchItems();
    } catch (err) {
      console.error("삭제 실패", err);
      setError("삭제에 실패했습니다.");
    }
  };

  const renderFormFields = () => {
    if (tab === "horror") {
      return (
        <>
          <input
            type="text"
            placeholder="제목"
            className="rounded-md border border-gray-200 p-2"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
          <textarea
            placeholder="질문"
            className="rounded-md border border-gray-200 p-2 min-h-[80px]"
            value={form.problem}
            onChange={(e) => setForm((prev) => ({ ...prev, problem: e.target.value }))}
          />
          <input
            type="text"
            placeholder="정답"
            className="rounded-md border border-gray-200 p-2"
            value={form.answer}
            onChange={(e) => setForm((prev) => ({ ...prev, answer: e.target.value }))}
          />
        </>
      );
    }

    return (
      <>
        <textarea
          placeholder="질문"
          className="rounded-md border border-gray-200 p-2 min-h-[80px]"
          value={form.question}
          onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
        />
        <input
          type="text"
          placeholder="정답"
          className="rounded-md border border-gray-200 p-2"
          value={form.answer}
          onChange={(e) => setForm((prev) => ({ ...prev, answer: e.target.value }))}
        />
      </>
    );
  };

  const renderListItem = (item) => {
    const draft = drafts[item.id] || {};

    if (tab === "horror") {
      return (
        <div key={item.id} className="rounded-lg border border-(--brand-100) p-3">
          <input
            className="w-full mb-2 rounded-md border border-gray-200 p-2"
            value={draft.title ?? item.title ?? ""}
            onChange={(e) =>
              setDrafts((prev) => ({
                ...prev,
                [item.id]: { ...prev[item.id], title: e.target.value, problem: draft.problem ?? item.problem, answer: draft.answer ?? item.answer },
              }))
            }
          />
          <textarea
            className="w-full mb-2 rounded-md border border-gray-200 p-2 min-h-[80px]"
            value={draft.problem ?? item.problem ?? ""}
            onChange={(e) =>
              setDrafts((prev) => ({
                ...prev,
                [item.id]: { ...prev[item.id], problem: e.target.value, title: draft.title ?? item.title, answer: draft.answer ?? item.answer },
              }))
            }
          />
          <input
            className="w-full mb-2 rounded-md border border-gray-200 p-2"
            value={draft.answer ?? item.answer ?? ""}
            onChange={(e) =>
              setDrafts((prev) => ({
                ...prev,
                [item.id]: { ...prev[item.id], answer: e.target.value, title: draft.title ?? item.title, problem: draft.problem ?? item.problem },
              }))
            }
          />
          <div className="flex gap-2">
            <Button text="수정" colorClass="bg-(--brand-600) text-white" clickEvent={() => updateItem(item.id)} />
            <Button text="삭제" colorClass="bg-red-500 text-white" clickEvent={() => deleteItem(item.id)} />
          </div>
        </div>
      );
    }

    return (
      <div key={item.id} className="rounded-lg border border-(--brand-100) p-3">
        <textarea
          className="w-full mb-2 rounded-md border border-gray-200 p-2 min-h-[80px]"
          value={draft.question ?? item.question ?? ""}
          onChange={(e) =>
            setDrafts((prev) => ({
              ...prev,
              [item.id]: { ...prev[item.id], question: e.target.value, answer: draft.answer ?? item.answer },
            }))
          }
        />
        <input
          className="w-full mb-2 rounded-md border border-gray-200 p-2"
          value={draft.answer ?? item.answer ?? ""}
          onChange={(e) =>
            setDrafts((prev) => ({
              ...prev,
              [item.id]: { ...prev[item.id], answer: e.target.value, question: draft.question ?? item.question },
            }))
          }
        />
        <div className="flex gap-2">
          <Button text="수정" colorClass="bg-(--brand-600) text-white" clickEvent={() => updateItem(item.id)} />
          <Button text="삭제" colorClass="bg-red-500 text-white" clickEvent={() => deleteItem(item.id)} />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">관리자 콘텐츠 관리</h2>
      
      {/* 카테고리 탭 */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tabItem) => (
          <Button
            key={tabItem.key}
            text={tabItem.label}
            colorClass={tab === tabItem.key ? "bg-(--brand-600) text-white" : "bg-(--brand-100) text-(--brand-800)"}
            clickEvent={() => {
              setTab(tabItem.key);
              setView("list");
            }}
          />
        ))}
      </div>

      {/* 등록/리스트 보기 토글 */}
      <div className="flex gap-2 mb-6">
        <Button
          text="등록하기"
          colorClass={view === "create" ? "bg-(--brand-600) text-white" : "bg-(--brand-100) text-(--brand-800)"}
          clickEvent={() => setView("create")}
        />
        <Button
          text="리스트 보기"
          colorClass={view === "list" ? "bg-(--brand-600) text-white" : "bg-(--brand-100) text-(--brand-800)"}
          clickEvent={() => setView("list")}
        />
      </div>

      {/* 등록 폼 */}
      {view === "create" && (
        <div className="rounded-lg border border-(--brand-100) p-4 mb-6">
          <h3 className="font-semibold mb-3">새 {tabs.find(t => t.key === tab)?.label} 등록</h3>
          <div className="flex flex-col gap-2">
            {renderFormFields()}
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button 
              text="등록" 
              colorClass="bg-(--brand-600) text-white" 
              clickEvent={handleCreateSuccess} 
            />
          </div>
        </div>
      )}

      {/* 리스트 보기 */}
      {view === "list" && (
        <>
          {loading ? (
            <p className="text-sm text-(--text-600)">불러오는 중...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-(--text-600)">등록된 항목이 없습니다.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => renderListItem(item))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminQuiz;
