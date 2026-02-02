import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Community from "./pages/Community.jsx";
import CommunityDetail from "./pages/CommunityDetail.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Quiz from "./pages/Quiz.jsx";
import Mypage from "./pages/Mypage.jsx";
import MemberInfo from "./pages/MemberInfo.jsx";
import MyCorrectQuiz from "./pages/MyCorrectQuiz.jsx";
import MyViewedContent from "./pages/MyViewedContent.jsx";
import MyFavorite from "./pages/MyFavorite.jsx";
import MyRecommend from "./pages/MyRecommend.jsx";
import Layout from "./layout/Layout.jsx";
import Write from "./pages/Write.jsx";
import RegisterMain from "./pages/RegisterMain.jsx";
import { LoginProvider } from "./context/loginContext.jsx";

import Nav from "./commonComponents/Nav.jsx";

function App() {
  return (
    <div className="min-h-screen bg-(--surface-1) text-(--text-900)">
      <Router>
        <LoginProvider>
          <Home>
            <Routes>
              {/* Layout 없이 렌더링할 페이지들 */}

              <Route path="/Community" element={<Community />} />
              <Route
                path="/Community/CommunityDetail/:board_id"
                element={<CommunityDetail />}
              />
              <Route path="/Community/write" element={<Write />} />
              {/* 게시글 수정 라우터 */}
              <Route path="/Community/write/:board_id" element={<Write />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Mypage" element={<Mypage />} />
              <Route path="/Mypage/info" element={<MemberInfo />} />
              <Route path="/Mypage/correct" element={<MyCorrectQuiz />} />
              <Route path="/Mypage/viewed" element={<MyViewedContent />} />
              <Route path="/Mypage/favorite" element={<MyFavorite />} />
              <Route path="/Mypage/recommend" element={<MyRecommend />} />
              <Route path="/Register" element={<RegisterMain />} />
              {/* Layout 적용 구간: path 가 "/KnowledgeHorror" 또는 "/Quiz" 인 경우에만 */}
              <Route element={<Layout />}>
                <Route path="/" element={<Quiz />} />
                <Route path="/Quiz" element={<Quiz />} />
              </Route>
            </Routes>
          </Home>
          <Nav />
        </LoginProvider>
      </Router>
    </div>
  );
}

export default App;
