import { useContext } from "react";
import { LoginContext } from "../context/loginContext";
import { useNavigate } from "react-router-dom";

function Mypage() {
  const navigate = useNavigate();
  const { logoutHandle } = useContext(LoginContext);
  const nickname = sessionStorage.getItem("user_nick");
  const user_id = sessionStorage.getItem("id");

  if(!user_id || !nickname){
    // alert("로그인 후 이용해주세요.");
    navigate("/Login");
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <button>
          <img src="./public/img/arrowLeft.svg" alt="" />
        </button>
      </div>
      <div className="flex items-center pb-3 mb-3 ">
        <img className="w-10" src="./public/img/poopNameImg.svg" alt="" />
        <h4 className="text-xm ml-4">{nickname} 님</h4>
      </div>
      <button
        type="button"
        onClick={() => navigate("/Mypage/info")}
        className="flex w-full items-center justify-between shadow-[0_0_5px_0_rgba(0,0,0,0.1),0_0_1px_0_rgba(0,0,0,0.1)] p-3 mb-2"
      >
        <p className="text-sm">회원정보</p>
        <img src="./public/img/arrowRight.svg" alt="" />
      </button>
      <div className="flex items-center justify-between shadow-[0_0_5px_0_rgba(0,0,0,0.1),0_0_1px_0_rgba(0,0,0,0.1)] p-3 mb-2">
        <p className="text-sm">내가 맞춘 퀴즈</p>
        <img src="./public/img/arrowRight.svg" alt="" />
      </div>
      <div className="flex items-center justify-between shadow-[0_0_5px_0_rgba(0,0,0,0.1),0_0_1px_0_rgba(0,0,0,0.1)] p-3 mb-2">
        <p className="text-sm">내가 본 컨텐츠</p>
        <img src="./public/img/arrowRight.svg" alt="" />
      </div>
      <div className="flex items-center justify-between shadow-[0_0_5px_0_rgba(0,0,0,0.1),0_0_1px_0_rgba(0,0,0,0.1)] p-3 mb-2">
        <p className="text-sm">나의 즐겨찾기 컨텐츠</p>
        <img src="./public/img/arrowRight.svg" alt="" />
      </div>
      <div className="flex items-center justify-between shadow-[0_0_5px_0_rgba(0,0,0,0.1),0_0_1px_0_rgba(0,0,0,0.1)] p-3 mb-2">
        <p className="text-sm">내가 추천한 컨텐츠</p>
        <img src="./public/img/arrowRight.svg" alt="" />
      </div>
      <div className="flex items-center justify-between shadow-[0_0_5px_0_rgba(0,0,0,0.1),0_0_1px_0_rgba(0,0,0,0.1)] p-3 mb-2">
        <p className="text-sm">고객센터</p>
        <img src="./public/img/arrowRight.svg" alt="" />
      </div>
      <div className="flex items-center justify-between shadow-[0_0_5px_0_rgba(0,0,0,0.1),0_0_1px_0_rgba(0,0,0,0.1)] p-3 mb-2">
        <p className="text-sm">개인정보 처리방침</p>
        <img src="./public/img/arrowRight.svg" alt="" />
      </div>
      <button className="flex w-full items-center mt-4 justify-center text-[#888888] text-xs" onClick={() => {logoutHandle()}}>
        로그아웃
      </button>
    </div>
  );
}

export default Mypage;
