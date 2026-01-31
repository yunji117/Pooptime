import { useState } from "react";
import { userRegister } from "../context/RegisterContext";

const RegisterBirth = ({ nextHandle }) => {

  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const { formData, updateFormData } = userRegister();

  // 다음 버튼
  const handleForward = (e) => {
    e.preventDefault()

    if (!birthdate || birthdate.trim() === "") {
      alert("생년월일을 입력해주세요.");
      return;
    }
    if (birthdate.length !== 8) {
      alert("생년월일은 8자리로 입력해주세요.");
      return;
    }
    if (isNaN(birthdate)) {
      alert("생년월일은 숫자로 입력해주세요.");
      return;
    }

    const formattedBirthdate = `${birthdate.slice(0, 4)}-${birthdate.slice(4, 6)}-${birthdate.slice(6, 8)}`;

    const updated = {
      birth_date: formattedBirthdate,
      gender: gender
    };
    updateFormData("gender", gender);
    updateFormData("birth_date", formattedBirthdate);

    nextHandle();
  }

  return (
    <div className="w-full ">
      {/* 1. 성별 */}
      <div className="mb-4">
        <label className="block font-bold mb-2 mt-3">성별</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              value="M"
              checked={gender === 'M'}
              onChange={(e) => setGender(e.target.value)}
              className="mr-2"
            />
            남자
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              value="F"
              className="mr-2"
              checked={gender === 'F'}
              onChange={(e) => setGender(e.target.value)}
            />
            여자
          </label>
        </div>
      </div>

      {/* 2. 생년월일 */}
      <div className="mb-4">
        <label className="block font-bold mb-2">생년월일</label>
        <input
          type="text"
          name="birthdate"
          placeholder="예: 19990101"
          maxLength="8"
          className="w-full p-2 border rounded bg-gray-200"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
        />
      </div>

      {/* 3. 다음 버튼 */}
      <div>
        <button
          onClick={handleForward}
          disabled={!gender || !birthdate}
          className={`w-full py-2 rounded transition-colors ${(gender && birthdate) ? 'bg-[color:var(--brand-600)] text-white hover:bg-[color:var(--brand-700)]' : 'bg-[color:var(--brand-100)] text-[color:var(--brand-700)] cursor-not-allowed'}`}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default RegisterBirth;