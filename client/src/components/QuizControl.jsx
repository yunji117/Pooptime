import Button from "./Button";

function QuizControl({btnText, answerBtn, prevBtn, nextBtn}){
  return(
    <div className="flex flex-col gap-5">
      <Button text={btnText} colorClass={"bg-(--brand-100) text-(--brand-800) hover:bg-(--brand-200) w-full"} clickEvent={answerBtn}/>
      <div className="flex justify-between">
        <Button text ='이전 문제' colorClass={"bg-(--brand-100) text-(--brand-800) hover:bg-(--brand-200) w-[45%]"} clickEvent={prevBtn}/>
        <Button text ='다음 문제' colorClass={"bg-(--brand-100) text-(--brand-800) hover:bg-(--brand-200) w-[45%]"} clickEvent={nextBtn}/>
      </div>
    </div>
  )
}

export default QuizControl;