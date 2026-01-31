function QuizCard({quizData, category}) {
  return(
    <div className="shadow-[0px_0px_4px_rgba(0,0,0,0.25)] rounded-md mb-7.5 p-4" key={quizData?.quiz_id || 0}>
      {category === 'horror' ? (
        <>
          <h3 className="font-bold text-lg mb-3">{quizData?.title || '...'}</h3>
          <p>{quizData?.problem || '...'}</p>
        </>
      ) : (
        <p>{quizData?.question || '...'}</p>
      )}
    </div>
  )
}

export default QuizCard;