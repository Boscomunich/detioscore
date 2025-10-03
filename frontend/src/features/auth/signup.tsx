import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

let url: string;

if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  url = "http://localhost:5173";
} else {
  url = "https://ditioscore.com";
}

const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.email({ message: "Invalid email address." }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function SignupForm() {
  const [seePassword, setSeePassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function signInWithGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: url,
    });
  }

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { data, error } = await authClient.signUp.email(
      {
        email: values.email, // user email address
        password: values.password, // user password -> min 8 characters by default
        name: values.username, // user display name
        callbackURL: "/", // A URL to redirect to after the user verifies their email (optional)
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Signup successful!");
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error(ctx.error.message);
        },
      }
    );
    console.log("data", data, "error", error);
  }

  return (
    <div className="max-w-sm px-4 border rounded-sm my-2 w-full pb-6 mx-auto mb-24">
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Your unique username" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e)}
                      type={seePassword ? "text" : "password"}
                      placeholder="Enter your password"
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
                  <div className="relative">
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e)}
                      type={seeConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      className="h-11 pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setSeeConfirmPassword(!seeConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      tabIndex={-1}
                    >
                      {seeConfirmPassword ? (
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
          <Button
            type="submit"
            className="w-full bg-lime-400 text-black text-xl font-semibold h-14"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader className="w-8 h-8 animate-spin text-white" />
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
      <div className="flex items-center my-4 gap-2">
        <hr className="flex-1 border-gray-300" />
        <p className="text-center text-sm text-gray-400 whitespace-nowrap">
          or continue with
        </p>
        <hr className="flex-1 border-gray-300" />
      </div>
      <Button
        className="w-full border bg-transparent flex items-center justify-center text-xl font-semibold h-14 text-foreground active:scale-105"
        onClick={() => signInWithGoogle()}
      >
        <img src="/icons/google.png" alt="Google" className="w-7 h-7 mr-2" />
        Sign up with Google
      </Button>
      <div className="mt-4 flex items-center flex-col justify-center gap-2">
        <h1>Already have an account</h1>
        <Link
          to="/signin"
          className="text-lime-500 hover:underline font-semibold"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
