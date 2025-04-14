import Link from "next/link";
import LoginButton from "./LoginButton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function LoginCard() {
  return (
    <Card className="w-[350px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          Welcome to Project Chaos
        </CardTitle>
        <CardDescription className="text-center">
          Your project management solution
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="text-sm text-muted-foreground text-center">
          Sign in with your Google account to get started
        </div>
        <LoginButton />
      </CardContent>
      <CardFooter>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our{" "}
          <Link href="/terms">Terms of Service</Link> and{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </div>
      </CardFooter>
    </Card>
  );
}
