import Button from "./Button";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../context/loginContext";

function LoginInput({ autoLogin }) {
  const navigate = useNavigate();
  // 아이디 입력
  // 비밀번호 입력
  // 로그인 버튼
  const [userId, setUserId] = useState("");
  const [pw, setPw] = useState("");
  const [text, setText] = useState("");
  const { loginHandle } = useContext(LoginContext);

  const login = async () => {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        user_id: userId,
        password: pw,
        autoLogin: autoLogin,
      }),
    });

    const result = await response.json();

    if (result.success) {
      setText("");
      setPw("");
      //성공하면 sessionStorage에 저장
      sessionStorage.setItem("id", result.user.id);
      sessionStorage.setItem("user_id", result.user.user_id);
      sessionStorage.setItem("user_nick", result.user.user_nick);
      // 성공하면 퀴즈로 이동
      navigate("/quiz");
      loginHandle();
    } else {
      setText(result.message);
    }
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder="아이디를 입력해주세요"
        className="bg-gray-300 px-4 py-2 rounded-md focus:bg-gray-100"
        maxLength={30}
        required
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      ></input>
      <input
        type="password"
        autoComplete="off"
        name="user_password"
        placeholder="비밀번호를 입력해주세요"
        className="bg-gray-300 px-4 py-2 rounded-md focus:bg-gray-100"
        required
        value={pw}
        onFocus={(e) => e.target.removeAttribute("readOnly")}
        onChange={(e) => setPw(e.target.value)}
      ></input>
      <p className="text-red-500">{text}</p>
      <Button
        text="로그인"
        colorClass=""
        clickEvent={() => login()}
      />
    </form>
  );
}

export default LoginInput;
