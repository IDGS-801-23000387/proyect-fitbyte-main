import React from "react";

export default function Keypad({ onNumber, onClear }) {
  const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="flex flex-wrap justify-center gap-2 w-full max-w-3xl mt-6">

      {numeros.map((num) => (
        <button
          key={num}
          onClick={() => onNumber(num)}
          className="w-14 h-14 bg-[#10141b] text-white text-xl font-bold rounded-lg 
                     shadow-md transition transform hover:scale-105 active:scale-95"
        >
          {num}
        </button>
      ))}

      <button
        onClick={onClear}
        className="w-24 h-14 bg-[#10141b] text-white font-bold rounded-lg shadow-md
                   transition hover:scale-105 active:scale-95"
      >
        Clear
      </button>

    </div>
  );
}
