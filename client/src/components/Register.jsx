import Input from "../components/Input.jsx"
import { useEffect, useState } from 'react'
import { userRegister } from '../context/registerContext.jsx'
import { checkUserId } from "../api/fectchApi.js"

function Register({ nextHandle }) {
  //아이디 값
  const [user, setUser] = useState('')
  //비밀번호
  const [pw, setPw] = useState('')
  const [checkPw, setCheckPw] = useState('') //비밀번호 확인
  const [showPw, setShowPw] = useState(false)
  const [showCheckPw, setShowCheckPw] = useState(false)

  //다음화면 보여줄 것인지
  const [disabled, setDisabled] = useState(true)

  //메시지
  const [idText, setIdText] = useState('30자 이내로 입력해주세요')
  const [pwText, setPwText] = useState('')
  const [pwCheckText, setCheckPwText] = useState('')

  //창고에서 데이터 가져오기
  const { updateFormData } = userRegister()

  //제출 -> 아이디, 비밀번호 값 담기
  const userCheck = (e) => {
    // 아이디 특수문자 안됨
    const input = e.target.value

    const hasChar = /[^a-zA-Z0-9]/

    if (hasChar.test(input)) {
      setIdText('아이디에 특수문자는 포함할 수 없습니다')
    } else {
      // setIdText('')
      setUser(input)
    }
  }

  useEffect(() => {
    //입력 내용이 없을 때
    if (user.length === 0) {
      setIdText('')
      return
    }

    //? fetchAPI를 사용함에 따라 기존의 코드 주석
    checkUserId(user).then(data => {
      if (data.status === 200) {
        setIdText(data.data.msg);
      } else if (data.status === 400) {
        setIdText(data.data.msg);
      }
    });
  }, [user])


  const pwCheck = (e) => {
    // 비밀번호 조건 충족    
    const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    //입력창 활성화를 위해 입력
    setPw(e.target.value)

    if (!pattern.test(e.target.value)) {
      setPwText('영문+숫자+특수문자로 8자 이상 입력해주세요')
    } else {
      setPwText('')
      setPw(e.target.value)
    }
  }

  const samePwCheck = (e) => {
    setCheckPw(e.target.value)
    if (pw === e.target.value) {
      setCheckPwText('비밀번호가 일치합니다')
    } else {
      setCheckPwText('다시 입력해주세요')
    }
  }

  useEffect(() => {
    if (idText === '사용 가능한 사용자입니다.' && pwText === '' && pwCheckText === '비밀번호가 일치합니다') {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [idText, pwText, pwCheckText]);

  //다음버튼 클릭이벤트
  const buttonClick = (e) => {
    e.preventDefault()
    updateFormData("user_id", user);
    updateFormData("password", pw);
    nextHandle();
  }

  return (
    <div className="w-full h-full">
      <div className="h-100 flex flex-col justify-center items-center">
        <form className="w-full" onSubmit={buttonClick}>
          <label className="text-sm text-black mb-2">아이디</label>
          <p
            className={`text-xs ${idText === "사용 가능한 사용자입니다."
              ? "text-green-500"
              : idText === "이미 존재하는 사용자입니다."
                ? "text-red-500"
                : ""
              }`}
          >
            {idText} <span className="text-gray-500">(영어 + 숫자만 가능합니다)</span>
          </p>
          <Input className={"bg-gray-300 h-10 w-full border-solid mb-8 p-2"} type="text" name="username" value={user} onChange={(e) => userCheck(e)} />
          <label className="text-sm text-black mb-2">비밀번호</label>
          <p className="text-red-500 text-xs">
            {pwText}
            {!pwText && (
              <span className="text-gray-500">(특수문자는 @ $ ! % * ? &만 허용됩니다)</span>
            )}
          </p>
          <div className="relative mb-8">
            <Input
              className={"bg-gray-300 h-10 w-full border-solid p-2"}
              type={showPw ? "text" : "password"}
              name="password"
              value={pw}
              onChange={(e) => pwCheck(e)}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600"
              onClick={() => setShowPw((prev) => !prev)}
            >
              {showPw ? "숨김" : "보기"}
            </button>
          </div>
          <label className="text-sm text-black mb-2">비밀번호 확인</label>
          <p
            className={`text-xs ${pwCheckText === "비밀번호가 일치합니다"
              ? "text-green-500"
              : pwCheckText === "다시 입력해주세요"
                ? "text-red-500"
                : "text-red-500"
              }`}
          >
            {pwCheckText}
          </p>
          <div className="relative mb-8">
            <Input
              className={"bg-gray-300 h-10 w-full border-solid p-2"}
              type={showCheckPw ? "text" : "password"}
              name="passwordCheck"
              value={checkPw}
              onChange={(e) => samePwCheck(e)}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600"
              onClick={() => setShowCheckPw((prev) => !prev)}
            >
              {showCheckPw ? "숨김" : "보기"}
            </button>
          </div>
          <button
            type="submit"
            className={`flex w-full justify-center rounded-[3px] p-2 mt-5  ${disabled ? "bg-gray-300" : "bg-blue-500"}`}
            disabled={disabled}
          >
            다음
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
