import { useNavigate } from "react-router";

interface GameCardProps {
  icon: string;
  title: string;
  description: string;
}

function GameCard({ icon, title, description }: GameCardProps) {
  const navigate = useNavigate();
  return (
    <div
      className="relative group w-full"
      onClick={() => navigate("/detio-score")}
    >
      {/* Card content */}
      <div className="relative bg-auto rounded-2xl p-6 border">
        <div className="flex items-start gap-5">
          {/* Icon container */}
          <div className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center border">
            <img className="text-blue-400" src={icon} />
          </div>

          {/* Text content */}
          <div className="flex-1 pt-1">
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-slate-400 text-base leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompetitionOverview() {
  return (
    <div className="flex items-center flex-col justify-center gap-2 mb-4 w-full">
      <GameCard
        icon="assets/goal.png"
        title="Top Score"
        description="Pick 5 teams you think will score the most goals!"
      />

      <GameCard
        icon="assets/ball-kick.png"
        title="Man Go Set"
        description="Pick one team to win from each league!"
      />
    </div>
  );
}
