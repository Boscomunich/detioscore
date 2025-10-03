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
import { Link, useLocation, useNavigate } from "react-router";
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

const formSchema = z.object({
  email: z.email({ message: "Invalid email address." }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function SigninForm() {
  const [seePassword, setSeePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: async () => {
          setIsLoading(false);
          // const { data, error } = await authClient.token();
          // if (error) {
          //   // handle error
          // }
          // if (data) {
          //   const jwtToken = data.token;
          //   console.log(jwtToken);
          // }
          toast.success(
            "Welcome to Ditioscore! you will be redirected back to the previous page"
          );
          setTimeout(() => {
            navigate(location.state?.pathname || "/");
          }, 2000);
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error(ctx.error.message);
        },
      }
    );
    setIsLoading(false);
  }

  async function signInWithGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: url,
    });
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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

          {/* Forgot Password link */}
          <div className="flex justify-end -mt-2">
            <Link
              to="/forgot-password"
              className="text-sm text-lime-500 hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>

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
              "Sign In"
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
        Sign in with Google
      </Button>
      <div className="mt-4 flex items-center flex-col justify-center gap-2">
        <h1>Don't have an account</h1>
        <Link
          to="/signup"
          className="text-lime-500 hover:underline font-semibold"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
