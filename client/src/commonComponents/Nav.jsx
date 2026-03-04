import { useState, useEffect, useRef } from "react";

import NavButton from "../components/NavButton";
import NavDiv from "../components/NavDiv";

function Nav() {
  const [btnClick, setBtnClick] = useState(false);
  // Ref로 dom 찾는 방법 처음은 null > 이후 랜더링 되면 ref={navRef}를 가진 요소를 찾아줌
  const navRef = useRef(null);

  const showNav = (event) => {
    event.stopPropagation(); // 이벤트가 전파되는것을 방지하는 코드 // 이게 없으면 navRef 이 요소 외의 것들을 클릭하면 navRef이 요소는 닫히게 되어있는데
    setBtnClick(true);
  };

  const closeNav = () => {
    setBtnClick(false);
  };

  // 화면의 다른 곳을 클릭하면 Nav를 닫음
  useEffect(() => {
    const handleClickOutside = (event) => {
      // navRef.current = ref={navRef}를 가진 요소를 찾아줌
      // navRef.current.contains(event.target) = 클릭한 곳이 navRef 영역 안에 포함되는지 체크함
      if (navRef.current && !navRef.current.contains(event.target)) {
        setBtnClick(false);

      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      // 컴포넌트가 언마운트 될 때 이벤트 리스너를 제거함 / 이유는 메모리 누수, 중복 실행을 막기 위해 정리하는 것.
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 z-40 w-full rounded-t-2xl flex items-center justify-center">
      <NavButton onClick={showNav} />
      <NavDiv
        navRef={navRef}
        btnClick={btnClick}
        closeNav={closeNav}
      ></NavDiv>
    </div>
  );
}

export default Nav;
