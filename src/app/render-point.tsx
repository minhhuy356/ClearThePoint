import React, { HTMLAttributes, useEffect, useRef, useState } from "react";
import { IStatusGame } from "./game";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  countPoint: string;
  statusGame: IStatusGame;
  isAutoPlay: boolean;
  setIsAutoPlay: React.Dispatch<React.SetStateAction<boolean>>;
  setStatusGame: React.Dispatch<React.SetStateAction<IStatusGame>>;
  setTimer: (value: number | ((prev: number) => number)) => void;
  onPointsEnd: () => void;
  resetSignal: boolean;
  setResetSignal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IPoint {
  index: number;
  isClick: boolean;
  time: number;
  x?: number;
  y?: number;
}

const RenderPoint = ({
  countPoint,
  isAutoPlay,
  resetSignal,
  setResetSignal,
  setIsAutoPlay,
  statusGame,
  setStatusGame,
  setTimer,
  onPointsEnd,
}: IProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [points, setPoints] = useState<IPoint[]>([]);
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    }
  }, [countPoint]);

  useEffect(() => {
    if (resetSignal && !statusGame.error && !statusGame.isSuccess) {
      handleRenderPoint();
    }

    if (
      (resetSignal && statusGame.error) ||
      (resetSignal && statusGame.isSuccess)
    ) {
      handleResetPoint();
    }
  }, [resetSignal]);

  const handleRenderPoint = () => {
    const pointSize = 64;
    const newPoints: IPoint[] = Array.from(
      { length: parseInt(countPoint) },
      (_, i) => {
        const x = Math.random() * (containerSize.width - pointSize);
        const y = Math.random() * (containerSize.height - pointSize);
        return {
          index: i + 1,
          isClick: false,
          time: 3000,
          x,
          y,
        };
      }
    );
    setPoints(newPoints);
    setResetSignal(false);
    setIsAutoPlay(false);
  };

  const handleResetPoint = () => {
    setPoints([]);
    setTimer(0);
    setStatusGame((prev) => ({
      ...prev,
      isPlay: false,
      error: false,
      isSuccess: false,
    }));
    setResetSignal(false);
    setIsAutoPlay(false);
  };

  useEffect(() => {
    if (statusGame.isPlay && !statusGame.isSuccess && !statusGame.error) {
      handleRenderPoint();
    } else if (!statusGame.isPlay && !statusGame.isSuccess) {
      handleResetPoint();
    }
  }, [statusGame.isPlay, statusGame.isSuccess, statusGame.error]);

  const handleClickPoint = (index: number) => {
    const point = points.find((p) => p.index === index);
    const isMinPoint = points.some((p) => p.index < index && !p.isClick);
    if (point?.isClick) return;

    setPoints((prev) =>
      prev.map((p) =>
        p.index === index ? { ...p, isClick: true, time: 3000 } : p
      )
    );

    if (isMinPoint) {
      setStatusGame((prev) => ({ ...prev, error: true }));
      return;
    }
  };

  useEffect(() => {
    if (statusGame.error) return;
    if (points.length === 0 && statusGame.isPlay) {
      onPointsEnd();
    }
    const activePoints = points.filter((p) => p.isClick && p.time > 0);

    if (activePoints.length === 0) return;

    const timer = setInterval(() => {
      setPoints((prev) => {
        const updatedPoints = prev
          .map((p) => {
            if (p.isClick && p.time > 0) {
              return { ...p, time: p.time - 100 };
            }
            return p;
          })
          .filter((p) => !(p.isClick && p.time <= 0));

        return updatedPoints;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [points, setStatusGame]);

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setPoints((prevPoints) => {
        const minPointIndex = prevPoints.findIndex((p) => !p.isClick);
        if (minPointIndex === -1) {
          clearInterval(timer);
          return prevPoints;
        }

        const newPoints = [...prevPoints];
        newPoints[minPointIndex] = {
          ...newPoints[minPointIndex],
          isClick: true,
        };
        return newPoints;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  return (
    <div
      className="w-full min-w-[704px] aspect-square border-[2px] border-black relative p-2"
      ref={containerRef}
    >
      {points.map((point) => (
        <div
          key={point.index}
          className={`size-16 flex flex-col gap-0 items-center justify-center rounded-full border border-black cursor-pointer  ${
            point.isClick ? "bg-red-500 " : "bg-white "
          } ${point.time === 0 && "hidden"} `}
          onClick={() => handleClickPoint(point.index)}
          style={{
            position: "absolute",
            left: point.x,
            top: point.y,
            width: 64,
            height: 64,
            zIndex: parseInt(countPoint) - point.index + 1,
            opacity: point.time / 3000,
          }}
        >
          <div className="text-black">{point.index}</div>
          <div className="text-white">
            {point.isClick && <div>{(point.time / 1000).toFixed(1)}s</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderPoint;
