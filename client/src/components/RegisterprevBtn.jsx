function RegisterprevBtn({ flag, setFlag }) {
  if (flag === 0) {
    return null; // 약관 동의 페이지에서는 이전 버튼 숨김
  }

  return (
    <button
      className="bg-[color:var(--brand-100)] text-[color:var(--brand-800)] rounded-[3px] p-2 mt-5 hover:bg-[color:var(--brand-200)] transition-colors"
      onClick={() => {
        setFlag(flag - 1);
      }}
    >
      이전
    </button>
  );
}

export default RegisterprevBtn;
