function QuizCard({quizData, category, className = ""}) {
  return(
    <div
      className={`shadow-[0px_0px_4px_rgba(0,0,0,0.25)] rounded-md p-4 bg-(--surface-0) ${className}`}
      key={quizData?.quiz_id || 0}
    >
      {category === 'horror' ? (
        <>
          <h3 className="font-bold text-lg mb-3">{quizData?.title || '...'}</h3>
          <p className="whitespace-pre-wrap leading-7">{quizData?.problem || '...'}</p>
        </>
      ) : (
        <p className="whitespace-pre-wrap leading-7">{quizData?.question || '...'}</p>
      )}
    </div>
  )
}

export default QuizCard;
