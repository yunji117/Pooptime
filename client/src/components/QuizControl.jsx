import Button from "./Button";

function QuizControl({btnText, answerBtn, prevBtn, nextBtn}){
  return(
    <div className="flex flex-col gap-5">
      <Button text={btnText} colorClass={"bg-[color:var(--brand-100)] text-[color:var(--brand-800)] hover:bg-[color:var(--brand-200)] w-full"} clickEvent={answerBtn}/>
      <div className="flex justify-between">
        <Button text ='이전 문제' colorClass={"bg-[color:var(--brand-100)] text-[color:var(--brand-800)] hover:bg-[color:var(--brand-200)] w-[45%]"} clickEvent={prevBtn}/>
        <Button text ='다음 문제' colorClass={"bg-[color:var(--brand-100)] text-[color:var(--brand-800)] hover:bg-[color:var(--brand-200)] w-[45%]"} clickEvent={nextBtn}/>
      </div>
    </div>
  )
}

export default QuizControl;