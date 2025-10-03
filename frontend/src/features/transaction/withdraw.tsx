import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { authApiClient } from "@/api-config";
import { toast } from "sonner";

const withdrawalMethods = [
  { value: "transfer", label: "Bank Transfer", icon: Building2 },
];

export function WithdrawalPage() {
  const [step, setStep] = useState(1);
  const [dcAmount, setDcAmount] = useState("");
  const [usdValue, setUsdValue] = useState("");
  const [method, setMethod] = useState("");

  useEffect(() => {
    setUsdValue(
      Number(dcAmount) > 0 ? (Number(dcAmount) / 100).toFixed(2) : "0.00"
    );
  }, [dcAmount]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await authApiClient.post(
        "/transaction/create-withdrawal",
        data
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(
        "A withdrawal invoice has been created successfully, payment will be processed in 1-3 business days."
      );
      setStep(3);
      console.log(data);
    },
    onError: (error) => {
      toast.error("Error creating invoice. Please try again.");
      console.log(error);
    },
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-primary">
            Withdraw Diticoins
          </CardTitle>
          <p className="text-sm sm:text-base text-muted-foreground">
            Withdraw your Diticoins (DC). Conversion rate:{" "}
            <span className="font-semibold text-primary">100 DC = 1 USD</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <Label htmlFor="amount" className="text-sm font-semibold">
                Withdrawal Amount (in DC)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount in DC"
                value={dcAmount}
                onChange={(e) => setDcAmount(e.target.value)}
                className="h-12 text-base border-2 border-primary/20"
              />
              {Number(dcAmount) > 0 && (
                <p className="text-sm text-muted-foreground">
                  Equivalent in USD:{" "}
                  <span className="font-semibold text-primary">
                    ${usdValue}
                  </span>
                </p>
              )}
              <Button
                className="w-full h-12 text-sm font-semibold"
                variant="default"
                disabled={!dcAmount || Number(dcAmount) <= 0}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Label className="text-sm font-semibold">
                Select Withdrawal Method
              </Label>
              <div className="grid gap-3">
                {withdrawalMethods.map((m) => {
                  const Icon = m.icon;
                  return (
                    <Button
                      key={m.value}
                      variant={method === m.value ? "default" : "outline"}
                      className="h-14 justify-start border-2"
                      onClick={() => setMethod(m.value)}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {m.label}
                    </Button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  variant="default"
                  className="flex-1 h-12 text-sm font-semibold"
                  disabled={!method}
                  onClick={() => {
                    mutation.mutate({
                      amount: Number(dcAmount),
                      paymentMethod: method,
                      type: "withdrawal",
                    });
                  }}
                >
                  {mutation.isPending ? "Processing..." : "Confirm"}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
              <h3 className="text-xl font-bold text-primary">
                Withdrawal Request Submitted!
              </h3>
              <p className="text-sm text-muted-foreground">
                Your withdrawal of{" "}
                <span className="font-semibold">{dcAmount} DC</span> ($
                {usdValue}) via{" "}
                <span className="font-semibold">
                  {withdrawalMethods.find((m) => m.value === method)?.label}
                </span>{" "}
                has been submitted. Processing may take 1–3 business days.
              </p>
              <Badge className="bg-secondary text-muted-foreground text-xs">
                Transaction ID: TXN-{Date.now()}
              </Badge>
              <Button
                onClick={() => {
                  setDcAmount("");
                  setMethod("");
                  setStep(1);
                }}
                variant="default"
                className="w-full h-12 text-sm font-semibold"
              >
                Make Another Withdrawal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
