import { useLocation, useNavigate, useParams } from "react-router-dom";
import QuilEditor from "../components/QuilEditor.jsx";
import { useEffect, useState } from "react";

function Write() {
  //링크에 숫자가 있으면
  const params = useParams();
  const [page, setPage] = useState(params.board_id || null);
  //입력될 내용
  const location = useLocation();
  const [data, setData] = useState(location.state || {});
  // 작성 완료 -> 상세페이지로 이동
  const navigate = useNavigate();

  // 유저 아이디
  const user_id = sessionStorage.getItem("id");
  // const user_pk = sessionStorage.getItem('id')

  // 글 등록 이벤트
  const writeBtn = async (e) => {
    e.preventDefault();
    //fetch
    const response = await fetch("http://localhost:8080/community/write", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        title: data.title,
        content: data.content,
      }),
    });

    if (response.ok) {
      alert("글 등록 성공");
      navigate("/community");
    } else {
      alert("등록 실패했습니다");
    }
  };

  //수정 클릭 이벤트
  const editBtn = async (e) => {
    e.preventDefault();

    //fetch
    const response = await fetch(
      `http://localhost:8080/community/update/${data.board_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: data.title, content: data.content }),
      }
    );

    if (response.ok) {
      alert("글 수정 성공");
      navigate(`/community/communityDetail/${page}`);
    } else {
      alert("수정 실패했습니다");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <h1 className="mt-5 font-bold">게시글 작성</h1>

      <div className="flex flex-col items-center justify-center w-full mt-7.5 mb-auto">
        <form className="w-full">
          <div className="mb-4 flex flex-col gap-4 w-full">
            <input
              className="border-2 px-1 border-solid rounded-lg w-full h-10 mb-4"
              type="text"
              id="title"
              name="title"
              required
              placeholder="제목"
              onChange={(e) => setData({ ...data, title: e.target.value })}
              value={params ? data.title : "제목"}
            />
            <QuilEditor
              value={params ? data.content : null}
              onChange={(content) => setData({ ...data, content: content })}
            />
          </div>
          <button
            className="mt-10 w-full bg-[color:var(--brand-600)] hover:bg-[color:var(--brand-700)] text-white font-bold py-2 px-4 rounded-md transition-colors"
            type="submit"
            onClick={page ? editBtn : writeBtn}
          >
            {page ? "수정하기" : "작성하기"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Write;
