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
import Spinner from "../Spinner";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useVerifySignUpMutation } from "../../tanstack/mutation/auth/mutation";

type PropsType = {
  onClose: () => void;
};

const formSchema = z.object({
  code: z.string().min(1, "enter the code sent to the provided email"),
});

const VerifySignUpModal = ({ onClose }: PropsType) => {
  const { mutate, data, error, isError, isSuccess, isPending } =
    useVerifySignUpMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      code: "",
    },
  });

  const navigate = useNavigate();

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
      navigate("/sign-in");
      return;
    }
  }, [isError, isSuccess, data, error]);
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

      <div className="border p-5 bg-white w-full max-w-lg rounded-md text-center">
        <h4 className="mb-10 font-bold text-lg">Confirmation Code</h4>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="  flex flex-col gap-8"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-center flex flex-col">
                    Enter 6 digit code sent to your email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="code"
                      {...field}
                      className="py-5"
                      type="code"
                    />
                  </FormControl>

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

export default VerifySignUpModal;
