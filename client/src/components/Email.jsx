// src/components/Email.jsx
import { useState, useEffect } from "react";
import { userRegister } from "../context/RegisterContext";
import { verifyEmail } from "../api/fectchApi";

function Email({ nextHandle }) {
  const [email, setemail] = useState('');
  const [isEmailVaild, setIsEmailVaild] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [authCode, setAuthCode] = useState(''); // 사용자가 입력하는 인증번호
  const [isCodeMatch, setIsCodeMatch] = useState(null); // null: 아직 입력 안 함, true/false
  const { updateFormData } = userRegister();

  // 인증 번호 1분에 1개, 타이머와 인터벌 ID 상태 추가
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [isCooldown, setIsCooldown] = useState(false);

  // 이메일 정규식 검사
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    setIsEmailVaild(validateEmail(email));
    setShowEmailError(email !== "" && !validateEmail(email));
  }, [email]);

  // 인터벌 클리어 (컴포넌트 언마운트 시)
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);
 


  // 인증코드 전송
  const handleSendCode = async () => {
    // 이미 타이머가 돌아가고 있다면 막기
    if (isCooldown) {alert("이미 인증번호를 전송했습니다.");   return};

    
    try {
      //? fetchAPI를 사용함에 따라 기존의 코드 주석
      verifyEmail(email).then(data => {
        if(data.status === 200){
          alert("이메일이 전송 되었습니다.");
        }
      })

      // 쿨다운 시작
      setIsCooldown(true)

      // 인증번호 1분 = 1개, 1분 타이머 시작
      // 타이머 및 쿨다운 설정
      setTimer(60); // 60초 시작
      const id = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(id); // 타이머 끝나면 정지
            setIsCooldown(false);  // 타이머 끝나면 쿨다운 해제
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setIntervalId(id); // 인터벌 ID 저장해서 나중에 정리



    } catch (err) {
      console.error(err);
      alert("인증번호 전송 실패!");
    }
  };

  const handleCheckCode = async (e) => {
    const value = e.target.value;
    setAuthCode(value);
    setIsCodeMatch(value);

    if (value.length === 6) {
      try {
        const res = await fetch("http://localhost:8080/email/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ code: value }),
        });

        const data = await res.json();
        setIsCodeMatch(data.success); // true or false
      } catch (err) {
        console.error(err);
        alert("인증번호 확인 실패!");
      }
    } else {
      setIsCodeMatch(null);
    }
  };

  const handleNext = () => {
    if (isCodeMatch && nextHandle) {
      updateFormData("email", email);
      nextHandle(); // 다음 단계로 이동
    }
  }


  return (
    <div className="flex flex-col gap-1 w-full">
      {/* 이메일 */}
      <form className="flex flex-col gap-1">
        <p className="text-sm">이메일</p>
        <div className="flex justify-between">

          <input type="text" className="w-9/12 bg-gray-300 focus:bg-gray-100"
            value={email}
            onChange={(e) => setemail(e.target.value)} />
          <button
            type="button"
            onClick={handleSendCode}
            disabled={!isEmailVaild}
            className={`px-4 py-2 rounded transition-colors ${isEmailVaild ? "bg-(--brand-600) text-white hover:bg-(--brand-700)" : "bg-(--brand-100) text-(--brand-800)"}`}
          >
            인증
          </button>
        </div>
        {showEmailError && (
          <p className="text-xs text-red-500">이메일 형식과 일치하지 않습니다</p>
        )}
      </form>
      {/* 이메일 인증 */}
      <div className="flex flex-col gap-1">
        <p className="text-sm" >이메일 인증</p>
        <input type='text' className="w-full bg-gray-300 py-2 focus:bg-gray-100"
          value={authCode}
          onChange={handleCheckCode}
        />
        {isCodeMatch === true && (
          <p className="text-xs text-green-500">인증번호가 일치합니다</p>
        )}
        {isCodeMatch === false && (
          <p className="text-xs text-red-500">다시 입력해주세요</p>
        )}
      </div>

      <button
        type="button"
        disabled={!isEmailVaild}
        onClick={handleNext}
        className={`w-full py-2 rounded transition-colors ${isCodeMatch ? "bg-(--brand-600) text-white hover:bg-(--brand-700)" : "bg-(--brand-100) text-(--brand-800)"}`}
      >
        다음
      </button>

    </div>
  )
}

export default Email;