import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Loader, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMutation } from "@tanstack/react-query";
import { authApiClient } from "@/api-config";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(3, { message: "Competition name is too short" }),
  numberOfTeams: z
    .number()
    .min(3, { message: "Minimum 3 teams required" })
    .max(20, { message: "Maximum 20 teams allowed" }),
  participantCap: z
    .number()
    .min(2, { message: "At least 2 participants required" }),
  price: z
    .number()
    .min(100, { message: "Prize money must be at least 100 Ditiocoins" }),
  visibility: z.enum(["public", "private"]).refine((val) => val !== undefined, {
    message: "Please select visibility type",
  }),
  rules: z
    .array(
      z.object({
        step: z.number(),
        description: z.string().min(3),
        stepVerification: z.boolean(),
      })
    )
    .optional(),
});

export default function CreateTopScoreCompetitionPage() {
  const [ruleDescription, setRuleDescription] = useState("");
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [rules, setRules] = useState<
    {
      step: number;
      description: string;
      stepVerification: boolean;
    }[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      numberOfTeams: undefined,
      participantCap: undefined,
      price: undefined,
      visibility: "public",
      rules: [],
    },
  });

  function handleAddRule() {
    if (!ruleDescription.trim()) return;

    // Prevent duplicates
    if (rules.some((r) => r.description === ruleDescription.trim())) return;

    const newRule = {
      step: rules.length + 1,
      description: ruleDescription.trim(),
      stepVerification: verificationRequired,
    };

    setRules([...rules, newRule]);
    setRuleDescription("");
    setVerificationRequired(false);
  }

  function handleRemoveRule(step: number) {
    const updated = rules.filter((r) => r.step !== step);
    const reIndexed = updated.map((r, idx) => ({
      ...r,
      step: idx + 1,
    }));
    setRules(reIndexed);
  }

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await authApiClient.post("/top-score/create", data);
      return res.data;
    },
    onSuccess: () => {
      // Maybe reset form, redirect, or show success toast
      form.reset();
      toast.success("Competition created successfully!");
    },
    onError: (error) => {
      toast.error("Error creating competition:");
      console.log(error);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const finalValues = { ...values, rules };
    console.log(finalValues);
    mutation.mutate(finalValues);
  }

  return (
    <div className="h-full min-h-[80vh] w-[95%] flex flex-col justify-center items-center max-w-4xl border rounded-sm my-2 mb-24 py-6 mx-auto px-6">
      <h1 className="text-2xl font-bold mb-6">Host a TopScore Competition</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full max-w-xl"
        >
          <FormDescription className="text-center">
            Fill in the details below to create and host a new TopScore
            competition. You can set the name, rules, and other requirements
          </FormDescription>

          {/* Competition Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Competition Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter competition name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Number of Teams */}
          <FormField
            control={form.control}
            name="numberOfTeams"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Teams</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  Number of teams each participant must select.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Participant Cap */}
          <FormField
            control={form.control}
            name="participantCap"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Participant Cap</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  Maximum participants allowed. Default is 100.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Prize */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prize (Ditiocoins)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  Prize money for the winner, deducted from your wallet.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Competition Visibility */}
          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Competition Visibility</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="public" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Public - Anyone can join
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="private" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Private - Invite only
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rules Section */}
          <div>
            <FormLabel>Competition Rules</FormLabel>

            {/* Display added rules */}
            <div className="flex flex-wrap gap-2 my-2">
              {rules.map((rule) => (
                <div
                  key={rule.step}
                  className="flex items-center gap-2 justify-between border rounded-md p-2"
                >
                  <div>
                    <p className="font-medium text-[12px]">
                      Step {rule.step}: {rule.description}
                    </p>
                    {rule.stepVerification && (
                      <p className="text-xs text-gray-500">
                        Verification required
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveRule(rule.step)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Input with Add button */}
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Enter a rule description"
                value={ruleDescription}
                onChange={(e) => setRuleDescription(e.target.value)}
              />
              <Button type="button" onClick={handleAddRule}>
                Add
              </Button>
            </div>

            {/* Verification Toggle */}
            <div className="flex items-center gap-2 mt-2">
              <Switch
                checked={verificationRequired}
                onCheckedChange={setVerificationRequired}
              />
              <span className="text-sm">Require verification</span>
            </div>

            <FormDescription>
              Add as many rules (steps) as you like. Each must be unique.
            </FormDescription>
          </div>

          <Button type="submit" className="w-full h-12">
            {mutation.isPending ? (
              <div className="flex justify-center py-10">
                <Loader className="w-8 h-8 animate-spin text-white" />
              </div>
            ) : (
              "Create Competition"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
