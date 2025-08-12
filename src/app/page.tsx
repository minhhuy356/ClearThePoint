import Image from "next/image";
import GameDetail from "./game";

export default function Home() {
  return (
    <div className="font-sans max-w-[800px] mx-auto w-full">
      <GameDetail />
    </div>
  );
}
