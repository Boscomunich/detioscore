import { Button } from "@/components/ui/button";
import type { Dispatch, SetStateAction } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Trophy, CheckCircle } from "lucide-react";
import type { Competition } from "@/types/competition";

interface CompetitionRuleProps {
  setStep: Dispatch<SetStateAction<number>>;
  competition: Competition;
}

const generalRules = [
  {
    name: "Team Selection",
    content:
      "Participants must select the required number of fixtures as specified by the host for each competition.",
  },
  {
    name: "Star Fixtures",
    content:
      "Each participant must choose one team as their star team. Star teams are unique to each competition and can serve as the deciding factor in the event of a draw.",
  },

  {
    name: "Point System",
    content:
      "Participants earn one point for every goal scored by their selected teams. In the case of a tie, the participant whose teams scored earlier goals will rank higher.",
  },
  {
    name: "Eligible Teams",
    content:
      "Only teams scheduled to play on the competition day are eligible for selection.",
  },
  {
    name: "Reward Payout",
    content:
      "All points are tallied, and rewards are distributed within 48 hours after the competition concludes.",
  },
];

export default function CompetitionRule({ setStep }: CompetitionRuleProps) {
  return (
    <div className="w-full flex flex-col items-center gap-4 mb-16">
      <div className="w-[70%] max-w-[500px] text-center text-xl">
        Complete the test that aims to motivate the user and reveal his
        determined start team which one has the highest score
      </div>
      <div>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-balance">
            Competition Rules & Guidelines
          </h1>
          <p className="text-medium text-gray-400 max-w-2xl mx-auto text-pretty mb-4">
            Please read all rules carefully before participating. Violation of
            any rule may result in disqualification.
          </p>
        </div>
        {/* General Competition Rules */}
        <Card className="shadow-lg mb-4">
          <CardHeader className="bg-primary text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Trophy className="h-6 w-6" />
              General Competition Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid gap-4">
              {generalRules.map((rule, index: number) => (
                <div className="flex items-start gap-3" key={index}>
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                    <p className="text-gray-600">{rule.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Button
        onClick={() => setStep((prev) => prev + 1)}
        className="w-full h-12 z-100"
      >
        Continue
      </Button>
    </div>
  );
}
