import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../Spinner";
import UpdateEmailModal from "./UpdateEmailModal";
import { useVerifyEmailMutation } from "../../tanstack/mutation/user/mutation";

const formSchema = z.object({
  password: z.string().min(1, "please type in your new password"),

  email: z.string().min(1, "please type in your new Email "),
});

const VerifyEmailModal = ({ onClose }: { onClose: () => void }) => {
  const { mutate, data, error, isPending, isError, isSuccess } =
    useVerifyEmailMutation();

  const [showUpdateEmailModal, setShowUpdateEmailModal] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const onEmailModalClose = () => {
    setShowUpdateEmailModal(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  useEffect(() => {
    if (isError) {
      if (error) {
        if (error.response.data) {
          toast.error(error.response.data.error);
          return;
        }
        if (error.code && error.code == "ERR_BAD_RESPONSE") {
          toast.error("Server error");
        }
      }
    }

    if (isSuccess) {
      toast.success(data.message);
      setSubmittedEmail(data?.data?.email);
      setShowUpdateEmailModal(true);
      return;
    }
  }, [isError, isSuccess, error]);

  return (
    <div className="fixed top-0 left-0 w-full h-screen flex flex-col gap-5 items-center justify-center overflow-hidden z-50 bg-[#000000ea] px-4">
      <div className="absolute right-5 top-10">
        <Button
          variant={"ghost"}
          onClick={onClose}
          className="text-red-400 font-bold text-lg"
        >
          Close X
        </Button>
      </div>

      <div className="border p-5 bg-white w-full max-w-lg rounded-md">
        <h4 className="mb-10 font-bold text-lg">Update Email Address</h4>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="  flex flex-col gap-8"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter your acc password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="password"
                      {...field}
                      className="py-5"
                      type="password"
                      autoComplete="off"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter your new email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email"
                      {...field}
                      className="py-5"
                      type="email"
                      autoComplete="off"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : " Proceed"}
            </Button>
          </form>
        </Form>
      </div>

      {showUpdateEmailModal && (
        <UpdateEmailModal onClose={onEmailModalClose} email={submittedEmail} />
      )}
    </div>
  );
};

export default VerifyEmailModal;
