function NavButton({onClick}){
  return(
    <button 
    onClick={onClick}
    className="flex items-center justify-center w-[70px] h-[70px] rounded-full bg-[color:var(--brand-600)] text-white p-2 mb-7 shadow-md hover:bg-[color:var(--brand-700)] transition-colors cursor-pointer"
    ></button>
  )
}

export default NavButton;