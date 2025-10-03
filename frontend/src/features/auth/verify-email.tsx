import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

import { CheckCircle, Mail } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function EmailVerificationPage() {
  const [isVerified, setIsVerified] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  async function verifyEmail(token: any) {
    try {
      await authClient.verifyEmail(
        {
          query: {
            token,
          },
        },
        {
          onSuccess: async () => {
            setIsVerified(true);
            setShowContent(true);
            setTimeout(() => {
              navigate("/signin");
            }, 2000);
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        }
      );
    } catch (err) {
      console.error("Verification failed:", err);
      setIsVerified(false);
    }
  }

  useEffect(() => {
    verifyEmail(token);
  }, [token]);

  return (
    <div className="min-h-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            {/* Animated Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                {!isVerified ? (
                  <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center animate-pulse">
                    <Mail className="w-10 h-10 text-accent animate-bounce" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center animate-pulse-success">
                    <CheckCircle className="w-10 h-10 text-success" />
                  </div>
                )}

                {/* Animated checkmark SVG overlay */}
                {isVerified && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-20 h-20"
                      viewBox="0 0 80 80"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-success/20"
                      />
                      <path
                        d="M25 40L35 50L55 30"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="100"
                        className="text-success animate-checkmark"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {!isVerified ? (
                <>
                  <h1 className="text-2xl font-bold text-foreground text-balance">
                    {"Verifying your email..."}
                  </h1>
                  <p className="text-muted-foreground text-pretty">
                    {
                      "Please wait while we confirm your email address. This should only take a moment."
                    }
                  </p>
                  <div className="flex justify-center mt-6">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className={`space-y-4 ${
                    showContent ? "animate-slide-up" : "opacity-0"
                  }`}
                >
                  <h1 className="text-2xl font-bold text-foreground text-balance">
                    {"Email verified successfully!"}
                  </h1>
                  <p className="text-muted-foreground text-pretty">
                    {
                      "Great! Your email address has been confirmed. You can now access all features of your account."
                    }
                  </p>

                  {/* Success details */}
                  <div className="bg-success/5 border border-success/20 rounded-lg p-4 mt-6">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      <div className="text-left">
                        <p className="font-medium text-success-foreground">
                          Verification complete
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
