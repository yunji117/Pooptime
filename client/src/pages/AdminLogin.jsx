import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { LoginContext } from "../context/loginContext";

function AdminLogin() {
  const navigate = useNavigate();
  const { loginHandle } = useContext(LoginContext);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const login = async () => {
    setError("");
    try {
      const response = await fetch("http://localhost:8080/login/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ user_id: userId, password }),
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        setError(result?.message || "관리자 로그인 실패");
        return;
      }

      sessionStorage.setItem("id", result.user.id);
      sessionStorage.setItem("user_id", result.user.user_id);
      sessionStorage.setItem("user_nick", result.user.user_nick);
      if (result.user.user_email) {
        sessionStorage.setItem("user_email", result.user.user_email);
      }
      sessionStorage.setItem("is_admin", String(result.user.is_admin));

      loginHandle();
      navigate("/Admin/quiz");
    } catch (err) {
      console.error("관리자 로그인 실패", err);
      setError("관리자 로그인 실패");
    }
  };

  return (
    <div className="flex flex-col justify-center h-full w-full gap-3">
      <h1 className="text-2xl mb-[30px]">관리자 로그인</h1>
      <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="관리자 아이디"
          className="bg-gray-300 px-4 py-2 rounded-md focus:bg-gray-100"
          maxLength={30}
          required
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            className="bg-gray-300 px-4 py-2 pr-10 rounded-md focus:bg-gray-100 w-full"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button text="관리자 로그인" colorClass="" clickEvent={login} />
      </form>
    </div>
  );
}

export default AdminLogin;
