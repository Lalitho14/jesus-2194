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
import { toast } from "@/components/ui/toast";
import { signup } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type signupData } from "@repo/validation";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<signupData>({
    resolver: zodResolver(signupSchema),
  });

  const router = useNavigate();

  const onSubmit = async (data: signupData) => {
    try {
      const res = await signup(data);

      toast.add({
        type: "success",
        title: "Success!",
        description: res.message,
      });

      router("/");
    } catch (error) {
      toast.add({
        type: "error",
        title: "Error",
        description: error instanceof Error ? error.message : "Server error",
      });
    }
  };

  return (
    <main className="min-h-screen animate-fade-in flex flex-1 w-full justify-center items-center p-20">
      <Card className="w-full h-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome!</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} id="signup-form">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name:</FieldLabel>
                <Input
                  id="name"
                  placeholder="Type name..."
                  required
                  disabled={isSubmitting}
                  {...register("name")}
                />
                {errors.name && (
                  <FieldError>* {errors.name.message} *</FieldError>
                )}
              </Field>
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
                  placeholder="••••••••"
                  required
                  disabled={isSubmitting}
                  {...register("password")}
                />
                {errors.password && (
                  <FieldError>* {errors.password.message} *</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm_password">
                  Confirm password:
                </FieldLabel>
                <Input
                  id="confirm_password"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={isSubmitting}
                  {...register("confirm_password")}
                />
                {errors.confirm_password && (
                  <FieldError>* {errors.confirm_password.message} *</FieldError>
                )}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" form="signup-form">
            {isSubmitting && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign up
          </Button>
          <div className="flex w-full items-center justify-end">
            <Link to="/" className="underline underline-offset-4">
              Already registered?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
