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
import { Eye, EyeOff, Loader } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const formSchema = z
  .object({
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm() {
  const [seePassword, setSeePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    await authClient.resetPassword(
      {
        token,
        newPassword: values.password,
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Password has been reset. Please sign in.");
          navigate("/signin");
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

      <h2 className="text-xl font-bold text-primary mb-4">Reset Password</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Enter your new password below to reset your account.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={seePassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setSeePassword(!seePassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      tabIndex={-1}
                    >
                      {seePassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Confirm new password"
                    className="h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-lime-400 text-black text-xl font-semibold h-14"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin text-white mx-auto" />
            ) : (
              "Reset Password"
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
