import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginSchema, type loginData } from "@repo/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/services/auth.service";
import { toast } from "@/components/ui/toast";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: loginData) => {
    try {
      const res = await login(data);

      console.log(res);

      //      if (res.ok) window.location.reload();
      //      else {
      toast.add({
        type: "error",
        title: "Error",
        description: res.message,
      });
      //    }
    } catch (error: any) {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <main className="min-h-screen animate-fade-in flex flex-1 w-full justify-center items-center p-20">
      <Card className="w-full h-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} id="login-form">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email:</FieldLabel>
                <Input
                  id="email"
                  placeholder="email@example.com"
                  type="email"
                  required
                  disabled={isSubmitting}
                  {...register("email")}
                />
                {errors.email && (
                  <FieldError>* {errors.email.message} *</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password:</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  disabled={isSubmitting}
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password && (
                  <FieldError>* {errors.password.message} *</FieldError>
                )}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" form="login-form">
            {isSubmitting && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </Button>
          <div className="flex w-full items-center justify-end">
            <Link to="/sign-up" className="underline underline-offset-4">
              Are you new?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
