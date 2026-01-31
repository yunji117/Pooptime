import React, { useEffect, useState } from "react";
import { checkUserNick, fetchRegister } from "../api/fectchApi.js";
import { useNavigate } from "react-router-dom";
import { userRegister } from "../context/RegisterContext.jsx";

const RegisterNickname = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = userRegister();
  const [nickname, setNickname] = React.useState("");
  const [isNickMatch, setIsNickMatch] = useState(null);
  const [nickError, setNickError] = useState("");

  const handelSubmit = async (e) => {
    if (!nickname || nickname.trim() === "") {
      alert("닉네임을 입력해주세요.");
      return;
    }
    if (nickname.length < 2 || nickname.length > 20) {
      alert("닉네임은 2자리 이상 8자리 이하로 입력해주세요.");
      return;
    }
    if (!/^[a-zA-Z0-9가-힣]+$/.test(nickname)) {
      alert("닉네임은 한국어 및 영문자와 숫자만 입력 가능합니다.");
      return;
    }

    try {
      const userData = await fetchRegister(formData);
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (err) {
      console.error("유저 등록 에러", err);
    }
  };

  useEffect(() => {
    if (nickname.length === 0) {
      return
    }

    checkUserNick(nickname).then(data => {
      if (data.status === 200) {
        setIsNickMatch(true);
        setNickError(data.data.msg);
        updateFormData("user_nick", nickname);
      } else if (data.status === 400) {
        setIsNickMatch(false)
        setNickError(data.data.msg);
      }
    })
  }, [nickname])


  return (
    <div className="w-full ">
      <div className="mb-4">
        <label className="block font-bold mb-2">닉네임</label>
        {isNickMatch === true && (
          <p className="text-green-500 text-xs">{nickError}</p>
        )}
        {isNickMatch === false && (
          <p className="text-red-500 text-xs">{nickError}</p>
        )}
        <input
          type="text"
          name="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임을 입력해 주세요"
          maxLength="8"
          className="w-full p-2 border rounded bg-gray-200"
        />
      </div>

      {/* 3. 다음 버튼 */}
      <div>
        <button
          onClick={handelSubmit}
          type="submit"
          className={`w-full py-2 rounded transition-colors ${nickname === "" ? "bg-[color:var(--brand-100)] text-[color:var(--brand-700)]" : "bg-[color:var(--brand-600)] text-white hover:bg-[color:var(--brand-700)]"
            }`}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default RegisterNickname;
