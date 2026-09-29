import Image from "next/image";
import { useState } from "react";
import type { Player } from "@/types/player";
import type { Mode } from "@/types/game";
import { formatValue, modeDetails } from "@/lib/format";
import { valueFor } from "@/lib/game-engine";
export function PlayerPanel({
  player,
  mode,
  hidden,
  side,
  revealed,
  children,
}: {
  player: Player;
  mode: Mode;
  hidden: boolean;
  side: "left" | "right";
  revealed?: boolean;
  children?: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const words = player.name.split(" ");
  const surname = words.pop()!;
  const initials = player.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  const photo =
    player.image?.startsWith("/") && !player.image.startsWith("//") && !failed;
  return (
    <article
      className={`player-panel ${side} ${revealed ? "revealed" : ""}`}
      aria-label={`${side === "left" ? "Reference" : "Challenger"}: ${player.name}`}
    >
      <div className="poster-initials" aria-hidden="true">
        {initials}
      </div>
      {photo && (
        <Image
          className="player-photo"
          src={player.image!}
          alt=""
          fill
          sizes="(max-width: 700px) 100vw, 50vw"
          onError={() => setFailed(true)}
        />
      )}
      <div className="panel-top">
        <span>{side === "left" ? "The benchmark" : "Your call"}</span>
        <span>{player.position}</span>
      </div>
      <div className="player-content">
        <h2 className={player.name.length > 20 ? "long-name" : ""}>
          <span className="given-name">{words.join(" ") || "United’s"}</span>
          <span
            className={`surname ${surname.length > 8 ? "long-surname" : ""}`}
          >
            {surname}
          </span>
        </h2>
        <p className="player-meta">
          {player.nationality}
          <span aria-hidden="true"> / </span>
          {player.careerLabel ||
            (player.unitedEndYear
              ? `${player.unitedStartYear}–${player.unitedEndYear}`
              : `Joined ${player.unitedStartYear}`)}
        </p>
        <div
          className={`stat-number ${hidden ? "unknown" : ""} ${mode === "transfer_fee" || mode === "united_years" ? "with-unit" : ""}`}
          key={hidden ? "hidden" : player.id}
          data-testid={`${side}-value`}
        >
          {hidden ? "???" : formatValue(valueFor(player, mode)!, mode)}
        </div>
        <p className="stat-label">{modeDetails[mode].unit}</p>
      </div>
      {children}
    </article>
  );
}
