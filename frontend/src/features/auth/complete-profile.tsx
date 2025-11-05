import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

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

import { CountrySelect } from "@/components/ui/country-select";
import { authClient } from "@/lib/auth-client";

// ✅ Zod schema for country-only form
const formSchema = z.object({
  country: z.string().min(1, { message: "Please select your country." }),
});

export function CompleteProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { country: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const { error } = await authClient.updateUser({
        country: values.country,
      } as any);

      if (error) throw error;

      toast.success("country updated successfully!");
      navigate(-1);
      setTimeout(() => navigate("/"), 100);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12 px-4 border rounded-md py-8 w-full">
      <div className="text-center mb-6">
        <img
          src="/assets/logo.png"
          alt="Logo"
          className="size-12 mx-auto mb-3"
        />
        <h1 className="text-2xl font-bold">Complete Your Profile</h1>
        <p className="text-sm text-muted-foreground">
          Please select your country to finish setting up your account.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Country Select Field */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <CountrySelect
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select your country"
                  />
                </FormControl>
                <FormDescription>
                  This helps personalize your experience.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 bg-lime-400 text-black font-semibold text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Continue"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
