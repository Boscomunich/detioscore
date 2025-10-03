import { Button } from "@/components/ui/button";
import type { Dispatch, SetStateAction } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Trophy, CheckCircle } from "lucide-react";
import type { Competition } from "../../type";

interface CompetitionRuleProps {
  setStep: Dispatch<SetStateAction<number>>;
  competition: Competition;
}

const generalRules = [
  {
    name: "Team Selection",
    content:
      "Participant selects the required number of teams as specified by Host",
  },
  {
    name: "Star Team",
    content:
      "Participant must pick one team as the star team and star teams are unique per competition",
  },
  {
    name: "Task Completion",
    content:
      "Participant must complete the user task and upload proof if required by Host. Failure to complete task or fraudulent upload of proof will lead to disqualification",
  },
  {
    name: "Point System",
    content:
      "Every selected team earns 3 points for a win, 2 points for a draw, and 0 points for a loss. Star team points are tripled",
  },
  {
    name: "Eligible Teams",
    content:
      "Teams to be selected must be teams in action on the day of the competition",
  },
  {
    name: "Reward Payout",
    content:
      "Points are calculated and rewards paid out within 24 hours after competition ends",
  },
];

export default function CompetitionRule({
  setStep,
  competition,
}: CompetitionRuleProps) {
  const hasStepVerification = competition.rules.some(
    (rule: any) => rule.stepVerification
  );

  function setNextStep() {
    if (!hasStepVerification) {
      setStep((prev) => prev + 2);
    } else {
      setStep((prev) => prev + 1);
    }
  }
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

        <Card className="shadow-lg">
          <CardHeader className="bg-primary text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Trophy className="h-6 w-6" />
              Host Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid gap-4">
              {competition?.rules.map((rule, index: number) => (
                <div className="flex items-start gap-3" key={index}>
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      step: {rule.step}
                    </h3>
                    <p className="text-gray-600">{rule.description}</p>
                    {rule.stepVerification && (
                      <p className="text-gray-600">upload proof</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Button onClick={() => setNextStep()} className="w-full h-12 z-100">
        Continue
      </Button>
    </div>
  );
}
