"use client";
import { HTMLAttributes, useEffect, useState } from "react";
import RenderPoint from "./render-point";

interface IProps extends HTMLAttributes<HTMLDivElement> {}

export interface IStatusGame {
  isPlay: boolean;
  isSuccess: boolean;
  error: boolean;
}

const GameDetail = () => {
  const [statusGame, setStatusGame] = useState<IStatusGame>({
    isPlay: false,
    isSuccess: false,
    error: false,
  });

  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [countPoint, setCountPoint] = useState<string>("5");
  const [timer, setTimer] = useState<number>(0);
  const [resetSignal, setResetSignal] = useState<boolean>(false);

  const handlePlayGame = () => {
    setStatusGame((prev) => ({
      ...prev,
      isPlay: true,
    }));
  };

  const handleChangePoint = (value: string) => {
    if (value === "" || /^[0-9]*$/.test(value)) {
      setCountPoint(value);
    }
    if (statusGame.isPlay) {
      setStatusGame((prev) => ({ ...prev, isPlay: false }));
    }
  };

  const handleResetGame = () => {
    setResetSignal(true);
  };

  const handleAutoPlay = (isAutoPlayIn: boolean) => {
    setIsAutoPlay(isAutoPlayIn);
  };

  useEffect(() => {
    if (!statusGame.isPlay || statusGame.isSuccess || statusGame.error) return;
    const intervalId = setInterval(() => {
      setTimer((prev) => prev + 100);
    }, 100);

    return () => clearInterval(intervalId);
  }, [statusGame]);

  const handlePointsEnd = () => {
    setStatusGame((prev) => ({ ...prev, isSuccess: true, isPlay: false }));
  };

  return (
    <div className="py-8">
      <div className="px-12 flex gap-8 flex-col">
        <div className="flex flex-col gap-4">
          <div>
            {statusGame.isSuccess ? (
              <h1 className="font-bold text-green-400">ALL CLEARED</h1>
            ) : statusGame.error ? (
              <h1 className="font-bold text-red-500">GAME OVER</h1>
            ) : (
              <h1 className="font-bold ">LET PLAY'S</h1>
            )}
          </div>
          <div className="flex gap-2">
            <p className="basis-[100px] shrink-0">Points:</p>
            <input
              type="text"
              className="border-black border-[1px] rounded px-2"
              value={countPoint}
              onChange={(e) => handleChangePoint(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <p className="basis-[100px] shrink-0">Time:</p>
            <p>{(timer / 1000).toFixed(1)}s</p>
          </div>
          {!statusGame.isPlay && !statusGame.isSuccess ? (
            <div className="">
              <button
                className="bg-gray-300 px-12 py-1 rounded cursor-pointer border-black border-[1px] hover:bg-gray-200"
                type="button"
                onClick={() => handlePlayGame()}
              >
                Play
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                className="bg-gray-300 px-12 py-1 rounded cursor-pointer border-black border-[1px] hover:bg-gray-200"
                type="button"
                onClick={() => handleResetGame()}
              >
                Restart
              </button>
              {!statusGame.error && !statusGame.isSuccess && (
                <>
                  {" "}
                  {!isAutoPlay ? (
                    <button
                      className="bg-gray-300 px-12 py-1 rounded cursor-pointer border-black border-[1px] hover:bg-gray-200"
                      type="button"
                      onClick={() => handleAutoPlay(true)}
                    >
                      Auto Play On
                    </button>
                  ) : (
                    <button
                      className="bg-gray-300 px-12 py-1 rounded cursor-pointer border-black border-[1px] hover:bg-gray-200"
                      type="button"
                      onClick={() => handleAutoPlay(false)}
                    >
                      Auto Play Off
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <RenderPoint
          countPoint={countPoint}
          isAutoPlay={isAutoPlay}
          setIsAutoPlay={setIsAutoPlay}
          statusGame={statusGame}
          setStatusGame={setStatusGame}
          setTimer={setTimer}
          onPointsEnd={handlePointsEnd}
          resetSignal={resetSignal}
          setResetSignal={setResetSignal}
        />
      </div>
    </div>
  );
};

export default GameDetail;
