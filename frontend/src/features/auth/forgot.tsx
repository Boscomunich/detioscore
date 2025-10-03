import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader } from "lucide-react";
import { Link } from "react-router";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.email({ message: "Invalid email address." }),
});

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await authClient.requestPasswordReset(
      {
        email: values.email,
        redirectTo: `${window.location.origin}/reset-password`,
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Password reset link sent! Check your email inbox.");
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error(ctx.error.message);
        },
      }
    );
  }

  return (
    <div className="max-w-sm px-4 border rounded-sm my-2 w-full pb-6 mx-auto mb-24">
      <Link
        to="/"
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

      <h2 className="text-xl font-bold mb-4">Forgot your password?</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Enter your email and we’ll send you a link to reset your password.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    className="h-11 pr-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-lime-400 text-black text-lg font-semibold h-12"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin text-white mx-auto" />
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-4 text-center">
        <Link
          to="/signin"
          className="text-lime-500 hover:underline font-medium"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
