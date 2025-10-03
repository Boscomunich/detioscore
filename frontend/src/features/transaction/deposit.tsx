import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Building2, CheckCircle, LockKeyhole } from "lucide-react";
import { authApiClient } from "@/api-config";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const paymentMethods = [
  { value: "card", label: "Credit/Debit Card", icon: CreditCard },
  { value: "transfer", label: "Bank Transfer", icon: Building2 },
];

const quickAmounts = [50, 100, 250, 500, 1000];
const USD_TO_DC = 60;

export function DepositPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleAmountSelect = (value: number) => {
    setAmount(value.toString());
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await authApiClient.post("/transaction/create-invoice", data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(
        "An invoice has been created successfully, you will be redirected to the payment gateway."
      );
      setCurrentStep(4);
      console.log(data);
    },
    onError: (error) => {
      toast.error("Error creating inv");
      console.log(error);
    },
  });

  const dcAmount = amount ? Number(amount) * USD_TO_DC : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className="text-sm font-[500] flex justify-center items-center gap-1"
            >
              <LockKeyhole />
              Secured Deposit
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold ${
                      currentStep >= step
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border"
                    }`}
                  >
                    {currentStep > step ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-0.5 ml-4 ${
                        currentStep > step ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-16 text-xs font-medium">
              <span
                className={
                  currentStep >= 1 ? "text-primary" : "text-muted-foreground"
                }
              >
                Enter Amount
              </span>
              <span
                className={
                  currentStep >= 2 ? "text-primary" : "text-muted-foreground"
                }
              >
                Payment Method
              </span>
              <span
                className={
                  currentStep >= 3 ? "text-primary" : "text-muted-foreground"
                }
              >
                Confirm Deposit
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary">
                    {currentStep === 1 && "Step 1: Enter Amount"}
                    {currentStep === 2 && "Step 2: Select Payment Method"}
                    {currentStep === 3 && "Step 3: Confirm Deposit"}
                    {currentStep === 4 && "Deposit Successful"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {currentStep === 1 &&
                      "Choose how much you would like to deposit into your account."}
                    {currentStep === 2 &&
                      "Select your preferred payment method for this deposit."}
                    {currentStep === 3 &&
                      "Review your deposit details and confirm the transaction."}
                    {currentStep === 4 &&
                      "Your deposit has been processed successfully!"}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Step 1 */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <Label
                          htmlFor="amount"
                          className="text-sm font-medium text-foreground"
                        >
                          Deposit Amount
                        </Label>
                        <div className="mt-2">
                          <Input
                            id="amount"
                            type="number"
                            placeholder="Enter amount in USD"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="text-base h-12 border-2 border-primary/20 focus:border-primary"
                          />
                        </div>
                        {dcAmount > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            You will receive{" "}
                            <span className="font-semibold text-primary">
                              {dcAmount} Ditio Coins
                            </span>{" "}
                            (1 USD = {USD_TO_DC} DC)
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-foreground">
                          Quick Select
                        </Label>
                        <div className="grid grid-cols-5 gap-3 mt-2">
                          {quickAmounts.map((value) => (
                            <Button
                              key={value}
                              variant={
                                amount === value.toString()
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => handleAmountSelect(value)}
                              className="h-12 text-sm font-semibold border-2"
                            >
                              ${value}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={handleNextStep}
                        disabled={!amount || Number.parseFloat(amount) <= 0}
                        variant="default"
                        className="w-full h-12 text-sm font-semibold"
                      >
                        Continue
                      </Button>
                    </div>
                  )}

                  {/* Step 2 */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <Label className="text-sm font-medium text-foreground">
                          Payment Method
                        </Label>
                        <div className="grid grid-cols-1 gap-3 mt-2">
                          {paymentMethods.map((method) => {
                            const Icon = method.icon;
                            return (
                              <Button
                                key={method.value}
                                variant={
                                  paymentMethod === method.value
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => setPaymentMethod(method.value)}
                                className="h-14 justify-start text-left border-2 hover:border-primary/50"
                              >
                                <Icon className="h-5 w-5 mr-3" />
                                <span className="text-sm font-semibold">
                                  {method.label}
                                </span>
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                          className="flex-1 h-12 text-sm font-semibold border-2"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleNextStep}
                          disabled={!paymentMethod}
                          variant="default"
                          className="flex-1 h-12 text-sm font-semibold"
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3 */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="bg-secondary/50 p-6 rounded-lg border-2 border-primary/20">
                        <h3 className="font-semibold text-base text-primary mb-4">
                          Deposit Summary
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Amount (USD):
                            </span>
                            <span className="font-semibold">${amount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              You Get:
                            </span>
                            <span className="font-semibold text-primary">
                              {dcAmount} DC
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Payment Method:
                            </span>
                            <span className="font-semibold">
                              {
                                paymentMethods.find(
                                  (m) => m.value === paymentMethod
                                )?.label
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Processing Fee:
                            </span>
                            <span className="font-semibold">$0.00</span>
                          </div>
                          <div className="border-t pt-3 flex justify-between">
                            <span className="font-semibold">Total:</span>
                            <span className="font-bold text-primary">
                              ${amount}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(2)}
                          className="flex-1 h-12 text-sm font-semibold border-2"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={() =>
                            mutation.mutate({
                              amount: Number(amount),
                              paymentMethod,
                            })
                          }
                          disabled={mutation.isPending}
                          variant="default"
                          className="flex-1 h-12 text-sm font-semibold"
                        >
                          {mutation.isPending
                            ? "Processing..."
                            : "Confirm Deposit"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 4 */}
                  {currentStep === 4 && (
                    <div className="text-center space-y-6">
                      <div className="flex justify-center">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-2">
                          Deposit Successful!
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Your deposit of ${amount} ({dcAmount} DC) has been
                          processed and will appear in your account shortly.
                        </p>
                      </div>
                      <div className="bg-secondary/50 p-4 rounded-lg border-2 border-green-200">
                        <p className="text-xs text-muted-foreground">
                          Transaction ID: TXN-{Date.now()}
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setCurrentStep(1);
                          setAmount("");
                          setPaymentMethod("");
                        }}
                        variant="default"
                        className="w-full h-12 text-sm font-semibold"
                      >
                        Make Another Deposit
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-primary">
                    Security Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Fraud protection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Instant notifications</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
