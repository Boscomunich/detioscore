import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import CompetitionRule from "./rule";
import SelectTeamForm from "../../team-selection";

export default function JoinManGoSet() {
  const [step, setStep] = useState(1);
  const { state } = useLocation();

  useEffect(() => {
    if (state?.userStatus === "pending" || state.userStatus === "owner") {
      setStep(2);
    }
  }, [state?.userStatus, state.competition]);

  return (
    <div className="h-full min-h-[80vh] w-[95%] flex flex-col justify-center items-center max-w-4xl border rounded-sm my-2 mb-24 py-6 mx-auto px-2 md:px-6">
      <Link
        to=""
        className=" text-4xl font-bold flex justify-center gap-2 items-center my-6"
      >
        <img src="/assets/logo.png" alt="Logo" className="size-12" />
        <div>
          <h1>
            Ditio<span className="text-[#1E64AA]">Score</span>
          </h1>
          <p className="text-[14px]">Your game Your score.</p>
        </div>
      </Link>
      <div className="my-6 font-bold capitalize">
        <div className=" text-xl md:text-2xl gap-2">
          {state.competition.name} Mango set{" "}
        </div>
        <div className="text-[14px] text-[#1E64AA]">
          {state.competition.prizePool} DC Price
        </div>
      </div>
      {step === 1 ? (
        <CompetitionRule setStep={setStep} competition={state?.competition} />
      ) : (
        <SelectTeamForm competition={state?.competition} />
      )}
    </div>
  );
}
