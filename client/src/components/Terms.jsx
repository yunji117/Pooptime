import { useState } from "react";
// '자세히' 모달 컴포넌트 추가
import DetailModal from "../components/DetailModal";

function Terms({ nextHandle }) {

  const [allChecked, setAllChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  // 모달 상태
  const [modalContent, setModalContent] = useState(null);

  // '자세히' 모달 닫기 함수
  const closeModal = () => setModalContent(null);
  const handleAllChecked = () => {
    const newValue = !allChecked;
    setAllChecked(newValue);
    setPrivacyChecked(newValue);
    setTermsChecked(newValue);
  }

  const handlePrivacyChecked = () => {
    const newValue = !privacyChecked;
    setPrivacyChecked(newValue);
    if (newValue && termsChecked) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  };

  const handleTermsChecked = () => {
    const newValue = !termsChecked;
    setTermsChecked(newValue);
    if (newValue && privacyChecked) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  }

  return (
    <div>
      <div className="text-xl">
        <h2>회원가입 약관 동의</h2>
      </div>
      <div className="mt-6 mb-1">
        <label className="flex items-center mb-3">
          <input className="mr-2" type="checkbox" checked={allChecked} onChange={handleAllChecked} />
          <p className="text-xs">약관 전체 동의 하기</p>
        </label>
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center">
            <input className="mr-2" type="checkbox" checked={privacyChecked} onChange={handlePrivacyChecked} />
            <p className="text-xs">개인정보 수집 및 이용 동의 (필수)</p>
          </label>
          <button className="text-xs"
            onClick={() => setModalContent(
              <div>
                <h3 className="text-sm font-bold mb-2">이용약관</h3>
                <p className="text-[10px]">여기에 이용약관의 자세한 내용이 들어갑니다.</p>
              </div>
            )} >
            자세히
          </button>
        </div>
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center">
            <input className="mr-2" type="checkbox" checked={termsChecked} onChange={handleTermsChecked} />
            <p className="text-xs">이용약관 동의 (필수)</p>
          </label>
          <button className="text-xs"
            onClick={() => setModalContent(
              <div>
                <h3 className="text-sm font-bold mb-2">이용약관</h3>
                <p className="text-[10px]">여기에 이용약관의 자세한 내용이 들어갑니다.</p>
              </div>
            )} >
            자세히
          </button>
        </div>
        <div>
          <p className="text-[10px] text-[#939393]">
            모든 필수 약관에 동의하셔야 회원가입이 가능합니다. <br /> 📝
            [동의하기] 버튼을 누르면 약관에 동의한 것으로 간주됩니다.
          </p>
        </div>
        <button className={`flex w-full justify-center rounded-[3px] p-2 mt-5 transition-colors ${privacyChecked && termsChecked ? "bg-(--brand-600) text-white hover:bg-(--brand-700)" : "bg-(--brand-100) text-(--brand-700)"}`}
          onClick={() => {
            if (privacyChecked && termsChecked) {
              nextHandle() // 회원가입 페이지로 이동
            } else {
              alert("모든 필수 약관에 동의하셔야 회원가입이 가능합니다.");
            }
          }}
        >
          다음
        </button>

        <DetailModal isOpen={modalContent !== null} onClose={closeModal}>
          {modalContent}
        </DetailModal>
      </div>
    </div>

  );
}

export default Terms;
