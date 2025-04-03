"use client";
import React from "react";
import { useState } from "react";

const Task2Page = () => {
  const [squares, setSquares] = useState<boolean[]>(Array(9).fill(false));
  const [squaresInd, setSquaresInd] = useState<number[]>([]);
  const [resetInProgress, setResetInProgress] = useState<boolean>(false);

  const handleClick = (index: number) => {
    if (resetInProgress) return;
    if (index === 8) {
      resetAllSquares();
      return;
    }
    setSquares((prev) => {
      const newSquares = [...prev];
      newSquares[index] = !newSquares[index];
      return newSquares;
    });
    setSquaresInd([index, ...squaresInd]);
  };

  const resetAllSquares = () => {
    setResetInProgress(true);
    let delay = 0;
    const resetPromises = squaresInd.map((index) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setSquares((prev) => {
            const newSquares = [...prev];
            newSquares[index] = false;
            return newSquares;
          });
          resolve();
        }, delay);
        delay += 300;
      });
    });
    Promise.all(resetPromises).then(() => {
      setSquaresInd([]);
      setResetInProgress(false);
    });
  };
  return (
    <div className="h-[100vh] w-full flex flex-col items-center justify-center bg-black">
      <div className="text-2xl font-bold p-4">Task 2</div>
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
      <div className="p-4">
        {resetInProgress && (
          <div className="flex gap-2">
            <div className="font-bold text-xl">Resetting</div>
            <div className="w-7 h-7 border-3 border-black border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Task2Page;
