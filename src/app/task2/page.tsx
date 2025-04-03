"use client";
import React from "react";
import { useState, useEffect } from "react";
import { number } from "zod";
type Props = {};

const page = (props: Props) => {
  const [squares, setSquares] = useState<boolean[]>(Array(9).fill(false));
  const [squaresInd, setSquaresInd] = useState<number[]>([]);
  const [resetInProgress, setResetInProgress] = useState<boolean>(false);

  const handleClick = (index: number) => {
    if (resetInProgress) return;
    //if (squares[index]) return;
    if (index === 8) {
      resetAllSquares();
      return;
    }
    setSquares((prev) => {
      const newSquares = [...prev];
      newSquares[index] = !newSquares[index];
      return newSquares;
    });
    //console.log(index);
    setSquaresInd([index, ...squaresInd]);
  };

  const resetAllSquares = () => {
    setResetInProgress(true);
    let delay = 0;
    squaresInd.forEach((index, key) => {
      setTimeout(() => {
        setSquares((prev) => {
          const newSquares = [...prev];
          newSquares[index] = !newSquares[index];
          return newSquares;
        });
      }, delay);
      delay += 300;
    });
    setSquaresInd([]);
    setResetInProgress(false);
  };
  return (
    <div className="h-[100vh] w-full flex flex-col items-center justify-center bg-black">
      <div className="p-1">
        {resetInProgress && (
          <div className="flex gap-2">
            <div className="font-bold text-xl">Resetting</div>
            <div className="w-7 h-7 border-3 border-black border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {squares.map((isGreen, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className={`w-20 h-20 rounded-lg cursor-pointer transition-colors duration-300 ${
              isGreen ? "bg-green-500" : "bg-orange-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
