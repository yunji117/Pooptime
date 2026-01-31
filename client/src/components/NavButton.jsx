function NavButton({onClick}){
  return(
    <button 
    onClick={onClick}
    className="flex items-center justify-center w-17.5 h-17.5 rounded-full bg-(--brand-600) text-white p-2 mb-7 shadow-md hover:bg-(--brand-700) transition-colors cursor-pointer"
    ></button>
  )
}

export default NavButton;