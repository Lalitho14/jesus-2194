import { useEffect, type SetStateAction } from "react";
import { toast } from "./ui/toast";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { paymentSchema, type paymentData } from "@repo/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { charge } from "@/services/payment.service";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "./ui/input-group";
import { useAuth } from "@/auth/AuthProvider";

export default function WalletForm({
  open,
  onSuccess,
  onOpenChange,
}: {
  open: boolean;
  onSuccess: () => void;
  onOpenChange: (open: SetStateAction<boolean>) => void;
}) {
  const { getUserData } = useAuth();

  const form = useForm<paymentData>({
    resolver: zodResolver(paymentSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    form.reset({
      amount: 100,
      full_name: '',
      card_number: '',
      expiration_date: '',
      cvv: null
    });
  }, [form, open]);

  async function onSubmit(values: paymentData) {
    try {
      const res = await charge(values);

      await getUserData();

      toast.add({
        type: "success",
        title: "Deposit confirmed",
        description: res.message,
      });

    } catch (error) {
      toast.add({
        type: "error",
        title: "Deposit error",
        description: error instanceof Error ? error.message : "Server error",
      });
    } finally {
      if (onSuccess) onSuccess();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit(onSubmit)} id="wallet-form">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field >
              <FieldLabel htmlFor="amount">Amount:</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>$</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="amount"
                  placeholder="0.00"
                  type="number"
                  disabled={isSubmitting}
                  {...register("amount", { valueAsNumber: true })}
                />
              </InputGroup>
              {errors.amount && (
                <FieldError>* {errors.amount.message} *</FieldError>
              )}
            </Field>
            <Field >
              <FieldLabel htmlFor="full_name">Full name:</FieldLabel>
              <Input
                id="full_name"
                placeholder="Type name..."
                type="text"
                disabled={isSubmitting}
                {...register("full_name")}
              />
              {errors.full_name && (
                <FieldError>* {errors.full_name.message} *</FieldError>
              )}
            </Field>
            <Field >
              <FieldLabel htmlFor="card_number">Card number:</FieldLabel>
              <Input
                id="card_number"
                placeholder="XXXX XXXX XXXX XXX"
                required
                disabled={isSubmitting}
                {...register("card_number")}
              />
              {errors.card_number && (
                <FieldError>* {errors.card_number.message} *</FieldError>
              )}
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Field className="md:col-span-2">
                <FieldLabel htmlFor="expiration_date">Expiration date:</FieldLabel>
                <Input
                  id="expiration_date"
                  placeholder="MM/YY"
                  required
                  disabled={isSubmitting}
                  {...register("expiration_date")}
                />
                {errors.expiration_date && (
                  <FieldError>* {errors.expiration_date.message} *</FieldError>
                )}
              </Field>
              <Field className="md:col-span-2">
                <FieldLabel htmlFor="cvv">CVV:</FieldLabel>
                <Input
                  id="cvv"
                  placeholder="000"
                  disabled={isSubmitting}
                  {...register("cvv", { valueAsNumber: true })}
                  type="number"
                />
                {errors.cvv && (
                  <FieldError>* {errors.cvv.message} *</FieldError>
                )}
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" form="wallet-form">
              {isSubmitting && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}