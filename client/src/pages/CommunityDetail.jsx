import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../context/loginContext";
import Button from "../components/Button";
import Input from "../components/Input.jsx";

function CommunityDetail() {
  // params
  const params = useParams();
  //데이터
  const [data, setData] = useState([]);
  //날짜
  const [day, setDay] = useState("");
  //로그인 상태
  const { isLogin } = useContext(LoginContext);
  //로그인 > 닉네임 가져오기
  const [nick, setNick] = useState(sessionStorage.getItem("user_nick"), "");
  //동일한지
  const [isSame, setIsSame] = useState(false);
  //네비게이터
  const navigate = useNavigate();
  const [user_pk, setUserPk] = useState(null);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/community/post/${params.board_id}`)
      .then((response) => response.json())
      .then((i) => {
        setData(i);
      });
  }, [params]);

  useEffect(() => {
    setDay((data.date || "").split("T")[0].replace(/-/g, "."));
    setIsSame(nick === data.nickname);
    // setData(location.state)
  }, [data, isLogin]);

  //삭제 함수
  const deleteBtn = async (e) => {
    e.preventDefault();

    //fetch
    const response = await fetch(
      `http://localhost:8080/community/delete/${data.board_id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      alert("삭제 성공");
      navigate("/community");
    } else {
      alert("삭제 실패했습니다");
    }
    // const result = await response.json()
  };

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("user_id");
    const storedUserNick = sessionStorage.getItem("user_nick");
    const id = sessionStorage.getItem("id");

    if (!storedUserId || !storedUserNick) {
      // alert("로그인 후 이용해주세요.");
      navigate("/login");
    } else {
      setNick(storedUserNick);
      setUserPk(id);
    }
  }, []);

  useEffect(() => {
    if (!data.board_id) return;
    fetch(`http://localhost:8080/comment/${data.board_id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setComments)
      .catch(console.error);
  }, [data.board_id]);

  const commentWrite = async () => {
    if (!content || content.trim() === "") {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    const response = await fetch("http://localhost:8080/comment/write", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        content: content,
        user_id: Number(user_pk),
        board_id: Number(data.board_id),
      }),
    });
    if (!response.ok) throw new Error("댓글 작성 실패");
    await response.json();

    alert("댓글 작성 성공");
    setContent("");
    fetch(`http://localhost:8080/comment/${data.board_id}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then(setComments);
  };

  const formatCommentDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    const yy = String(kst.getUTCFullYear()).slice(-2);
    const mm = String(kst.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(kst.getUTCDate()).padStart(2, "0");
    const hh = String(kst.getUTCHours()).padStart(2, "0");
    const min = String(kst.getUTCMinutes()).padStart(2, "0");
    const ss = String(kst.getUTCSeconds()).padStart(2, "0");
    return `${yy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  return (
    <div className="w-full">
      <div>
        <h2 className="text-xl">커뮤니티 상세</h2>
      </div>
      {isLogin && isSame ? (
        <>
          <div className="">
            <Link to={`/community/write/${data.board_id}`} state={data}>
              <Button text={"수정"} colorClass={"bg-(--brand-100) text-(--brand-800) hover:bg-(--brand-200)"} />
            </Link>
            <Button
              text={"삭제"}
              colorClass={"bg-(--brand-100) text-(--brand-800) hover:bg-(--brand-200)"}
              clickEvent={(e) => deleteBtn(e)}
            />
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="mt-6 mb-1">
        <h4 className="text-xl">{data.title}</h4>
      </div>
      <div className="flex items-center border-b border-[#d9d9d9] pb-1 mb-1">
        <p className="text-sm mr-2">{data.nickname}</p>
        <span className="text-xs">{day}</span>
      </div>
      <div className="flex items-center mb-5">
        <div className="mr-3">
          <img src="" alt="" />
          <p className="text-sm">{data.recommand_amout}</p>
        </div>
        <div>
          <img src="" alt="" />
          <p className="text-sm">{data.view_amout}</p>
        </div>
      </div>
      <div>
        <div
          className="text-base"
          dangerouslySetInnerHTML={{ __html: data.content }}
        ></div>
      </div>
      <div className="flex items-center mt-3 mb-3">
        <button className="text-sm">
          <img src="" alt="" />
          <p>추천</p>
        </button>
        <button className="text-sm">
          <img src="" alt="" />
          <p>즐찾</p>
        </button>
      </div>

      {/*댓글영역*/}

      <div className="relative border w-full border-[#D9D9D9]/70 mb-3">
        <Input
          className="w-full outline-none p-2 pr-20 text-sm"
          type="text"
          placeholder="댓글을 입력해주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={commentWrite}
          className="absolute right-0 top-0 h-full bg-(--brand-600) border-(--brand-600) px-4 text-white whitespace-nowrap text-sm cursor-pointer"
        >
          확인
        </button>
      </div>
      <div>
        {comments.map((c) => (
          <div key={c.id} className="mb-2">
            <p className="font-bold">{c.user_nick}</p>
            <p>{c.content}</p>
            <span className="text-xs text-gray-500">{formatCommentDate(c.date)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommunityDetail;
