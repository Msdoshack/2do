import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePasswordMutation } from "../../tanstack/mutation/user/mutation";
import { useEffect } from "react";
import Spinner from "../Spinner";
import toast from "react-hot-toast";

const formSchema = z
  .object({
    password: z.string().min(1, "pls type in your current password"),
    newPassword: z.string().min(1, "pls type in your new password"),
    reTypePassword: z.string().min(1, "Pls re-type your new password"),
  })
  .refine((data) => data.newPassword === data.reTypePassword, {
    path: ["reTypePassword"], // Points to the retype field
    message: "Passwords do not match",
  });

const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
  const { mutate, data, error, isPending, isError, isSuccess } =
    useChangePasswordMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      password: "",
      newPassword: "",
      reTypePassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { reTypePassword, ...data } = values;
    mutate(data);
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
      onClose();
    }
  }, [isError, data, error, isSuccess]);
  return (
    <div className="fixed top-0 left-0 w-full h-screen flex flex-col gap-5 items-center justify-center overflow-hidden z-50 bg-[#000000ea] px-4">
      <div className="absolute right-5 top-10">
        <Button
          variant={"ghost"}
          onClick={onClose}
          className="text-red-400 font-bold"
        >
          Close X
        </Button>
      </div>

      <div className="border p-5 bg-white w-full max-w-lg rounded-md">
        <h4 className="mb-10 font-bold text-lg">Change Password</h4>
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
                  <FormLabel>Enter current password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="current password"
                      {...field}
                      className="py-5"
                      type="password"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="new password"
                      {...field}
                      type="password"
                      className="py-5"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reTypePassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Re-TypePassword</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="re-type new password"
                      {...field}
                      type="newPassword"
                      className="py-5"
                    />
                  </FormControl>
                  {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
