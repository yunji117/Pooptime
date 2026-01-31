
import React from "react";
import { Outlet } from "react-router-dom";
import Menu from "../commonComponents/Menu.jsx";
import Nav from "../commonComponents/Nav.jsx";

export default function Layout() {
  return (
    <>
      <Menu />
      <div className="flex justify-center items-center w-full mt-10">
        {/* 중첩된 Route 컴포넌트들이 이 자리에 렌더링 함 */}
        {/* Outlet 컴포넌트는 중첩된 Route의 자식 컴포넌트를 렌더링하는 역할을 함 */}
        <Outlet />
      </div>
    </>
  );
}
