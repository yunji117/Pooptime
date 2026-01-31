function Button({text, colorClass, clickEvent, disabled}){
  const resolvedClass = colorClass && colorClass.trim().length > 0
    ? colorClass
    : "bg-(--brand-600) text-white hover:bg-(--brand-700)";

  return(
    <button
      className={`${resolvedClass} py-2 px-4 rounded-md shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
      onClick={clickEvent || null}
      disabled={disabled || false}
    >
      {text}
    </button>
  )
}

export default Button;