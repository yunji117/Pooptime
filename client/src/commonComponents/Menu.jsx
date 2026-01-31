import { useNavigate } from "react-router-dom";

function Menu() {
  const navigate = useNavigate();
  const navHandle = (category) => {
    if (category === 'quiz') {
      navigate('/Quiz', {
        state: { category }
      })
    } else if (category === 'knowledge') {
      navigate('/Quiz', {
        state: { category }
      })
    } else if (category === 'horror') {
      navigate('/Quiz', {
        state: { category }
      })
    }
  }

  return (
    <div className="flex justify-between w-full ">
      <button
        className="bg-(--brand-100) text-(--brand-800) px-4 py-2 rounded-md hover:bg-(--brand-200) transition-colors"
        onClick={() => navHandle("quiz")}
      >
        퀴즈
      </button>
      <button
        className="bg-(--brand-100) text-(--brand-800) px-4 py-2 rounded-md hover:bg-(--brand-200) transition-colors"
        onClick={() => navHandle("knowledge")}
      >
        상식
      </button>
      <button
        className="bg-(--brand-100) text-(--brand-800) px-4 py-2 rounded-md hover:bg-(--brand-200) transition-colors"
        onClick={() => navHandle("horror")}
      >
        괴담
      </button>
    </div>
  );
}

export default Menu;
