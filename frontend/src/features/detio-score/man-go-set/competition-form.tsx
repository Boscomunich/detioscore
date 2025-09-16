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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMutation } from "@tanstack/react-query";
import { authApiClient } from "@/api-config";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(3, { message: "Competition name is too short" }),
  numberOfTeams: z
    .number()
    .min(3, { message: "Minimum 3 teams required" })
    .max(20, { message: "Maximum 20 teams allowed" }),
  participantCap: z
    .number()
    .min(2, { message: "At least 2 participants required" }),
  stake: z.number().min(1, { message: "can not stake less than 1 Ditiocoin" }),
  visibility: z.enum(["public", "private"]).refine((val) => val !== undefined, {
    message: "Please select visibility type",
  }),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

export default function CreateManGoSetCompetitionPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      numberOfTeams: 3,
      participantCap: 2,
      stake: 1,
      visibility: "public",
      startDate: "",
      endDate: "",
    },
  });

  const startDate = form.watch("startDate");

  useEffect(() => {
    if (startDate) {
      form.setValue("endDate", startDate);
    }
  }, [startDate, form]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await authApiClient.post("/man-go-set/create", data);
      return res.data;
    },
    onSuccess: () => {
      form.reset();
      toast.success("Competition created successfully!");
    },
    onError: (error) => {
      toast.error("Error creating competition:");
      console.log(error);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <div className="h-full min-h-[80vh] w-[95%] flex flex-col justify-center items-center max-w-4xl border rounded-sm my-2 mb-24 py-6 mx-auto px-6">
      <h1 className="text-2xl font-bold mb-6">Host a Man Go Set</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full max-w-xl"
        >
          <FormDescription className="text-center">
            Fill in the details below to create and host a new Man Go Set
            competition. You can set the name, stake, and other requirements
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
            name="stake"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stake (Ditiocoins)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  The coin to stake to enter the competition. Minimum is 1
                  Ditiocoin. any stake you enter will be the benchmark for
                  others to follow.
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
