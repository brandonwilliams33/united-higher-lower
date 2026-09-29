import { Game } from "@/components/Game";
import { createSession } from "@/lib/game-engine";
export default function Home() {
  return (
    <main id="main">
      <Game initialSession={createSession("appearances", "normal", () => 0)} />
    </main>
  );
}
