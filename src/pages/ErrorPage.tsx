import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold font-display text-foreground">
          {is404 ? "Page Not Found" : "Something went wrong"}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {is404
            ? "The page you're looking for doesn't exist or has been moved."
            : "An unexpected error occurred. Please try again."}
        </p>
        <Button asChild className="mt-8 gradient-primary text-primary-foreground border-0">
          <Link to="/">Back to Login</Link>
        </Button>
      </div>
    </div>
  );
}
