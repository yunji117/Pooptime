import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MemberInfo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({
    user_id: sessionStorage.getItem("user_id") || "",
    user_nick: sessionStorage.getItem("user_nick") || "",
    email: sessionStorage.getItem("user_email") || "",
    created_at: "",
  });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";
    const yy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yy}.${mm}.${dd}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/profile", {
          credentials: "include",
        });

        if (response.status === 401) {
          navigate("/Login");
          return;
        }

        const result = await response.json();
        if (result?.success) {
          setInfo(result.user);
        }
      } catch (err) {
        console.error("회원정보 조회 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
          <h4 className="text-base font-semibold text-(--text-900)">회원 정보</h4>
          <p className="text-xs text-(--text-600)">회원가입 시 입력한 정보를 확인하세요.</p>
        </div>
      </div>

      <div className="bg-(--surface-0) rounded-xl p-4 shadow-[0_0_5px_0_rgba(0,0,0,0.08)]">
        {loading ? (
          <p className="text-sm text-(--text-600)">불러오는 중...</p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-(--brand-100) pb-3">
              <span className="text-sm text-(--text-600)">아이디</span>
              <span className="text-sm font-medium text-(--text-900)">{info.user_id || "-"}</span>
            </div>
            <div className="flex items-center justify-between border-b border-(--brand-100) pb-3">
              <span className="text-sm text-(--text-600)">닉네임</span>
              <span className="text-sm font-medium text-(--text-900)">{info.user_nick || "-"}</span>
            </div>
            <div className="flex items-center justify-between border-b border-(--brand-100) pb-3">
              <span className="text-sm text-(--text-600)">이메일</span>
              <span className="text-sm font-medium text-(--text-900)">{info.email || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-(--text-600)">가입날짜</span>
              <span className="text-sm font-medium text-(--text-900)">{formatDate(info.created_at)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemberInfo;
