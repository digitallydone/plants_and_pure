"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { toast } from "@/components/ui/use-toast";
import { login } from "@/app/actions/auth";
import { toast } from "@/hooks/use-toast";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    facebook: false,
  });
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Clear error when user starts typing again
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email");
      const password = formData.get("password");
      const rememberMe = formData.get("remember-me") === "on";

      // First validate inputs
      if (!email || !password) {
        setError("Email and password are required");
        setIsLoading(false);
        return;
      }

      // Server-side validation
      const validationResult = await login(formData);
      if (!validationResult.success) {
        setError(
          validationResult.message ||
            "Please check your credentials and try again."
        );
        setIsLoading(false);
        return;
      }

      // Attempt sign in
      const result = await signIn("credentials", {
        email,
        password,
        remember: rememberMe,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        toast({
          title: "Success!",
          description: "You've been signed in successfully",
          variant: "success",
        });
        router.push(callbackUrl);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const phone = formData.get("phone");
      const password = formData.get("password-phone");
      const rememberMe = formData.get("remember-me-phone") === "on";

      // Basic validation
      if (!phone || !password) {
        setError("Phone and password are required");
        setIsLoading(false);
        return;
      }

      // TODO: Implement proper phone login logic
      // For now, we'll use the same credentials flow with a different identifier
      const result = await signIn("credentials", {
        identifier: phone,
        password,
        remember: rememberMe,
        isPhone: true,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid phone number or password");
      } else {
        toast({
          title: "Success!",
          description: "You've been signed in successfully",
          variant: "success",
        });
        router.push(callbackUrl);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Phone login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = (provider) => {
    // Update loading state for the specific provider
    setSocialLoading((prev) => ({ ...prev, [provider]: true }));

    // Direct call to signIn with redirect: true
    // This will perform a full page redirect handled by NextAuth
    signIn(provider, {
      callbackUrl,
      redirect: true,
    }).catch((err) => {
      console.error(`${provider} sign-in error:`, err);
      setError(`There was a problem signing in with ${provider}`);
      setSocialLoading((prev) => ({ ...prev, [provider]: false }));
    });
  };

  return (
    <Tabs defaultValue="email" className="w-full">
      {/* <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="phone">Phone</TabsTrigger>
      </TabsList> */}

      <TabsContent value="email">
        <form className="space-y-4" onSubmit={handleEmailLogin}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                required
                autoComplete="email"
                onChange={() => error && setError(null)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                required
                autoComplete="current-password"
                onChange={() => error && setError(null)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10 text-slate-400"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember-me"
              name="remember-me"
              className="rounded border-gray-300"
            />
            <Label htmlFor="remember-me" className="text-sm font-normal">
              Remember me
            </Label>
          </div>

          {error && (
            <div className="bg-red-50 p-3 rounded-md text-sm text-red-500 animate-in fade-in">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="phone">
        <form className="space-y-4" onSubmit={handlePhoneLogin}>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                className="pl-10"
                required
                autoComplete="tel"
                onChange={() => error && setError(null)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password-phone">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="password-phone"
                name="password-phone"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                required
                autoComplete="current-password"
                onChange={() => error && setError(null)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10 text-slate-400"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember-me-phone"
              name="remember-me-phone"
              className="rounded border-gray-300"
            />
            <Label htmlFor="remember-me-phone" className="text-sm font-normal">
              Remember me
            </Label>
          </div>

          {error && (
            <div className="bg-red-50 p-3 rounded-md text-sm text-red-500 animate-in fade-in">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}

export default function LoginPage() {
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    facebook: false,
  });

  const handleSocialSignIn = (provider) => {
    setSocialLoading((prev) => ({ ...prev, [provider]: true }));

    // Directly call NextAuth signIn with redirect true
    signIn(provider, {
      callbackUrl: "/dashboard",
      redirect: true,
    });
    // No catch needed as this will perform a full page redirect
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 py-12 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>

          {/* <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialSignIn("google")}
              type="button"
              disabled={socialLoading.google}
            >
              {socialLoading.google ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Google
                </>
              ) : (
                "Google"
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialSignIn("facebook")}
              type="button"
              disabled={socialLoading.facebook}
            >
              {socialLoading.facebook ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Facebook
                </>
              ) : (
                "Facebook"
              )}
            </Button>
          </div> */}
        </CardContent>
        <CardFooter className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
