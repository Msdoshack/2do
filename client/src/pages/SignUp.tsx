import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import GridWrapper from "../components/GridWrapper";
import ShowPassword from "../components/ShowPassword";
import { useEffect, useState } from "react";
import { useSignUpMutation } from "../tanstack/mutation/auth/mutation";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import VerifySignUpModal from "../components/modals/VerifySignUpModal";

const formSchema = z
  .object({
    username: z.string().min(1, "please type in your username"),
    email: z
      .string()
      .min(1, "please type in your email address")
      .max(50)
      .email("provide a valid email address"),
    password: z.string().min(1, "Pls type in your password"),

    reTypePassword: z.string().min(1, "Pls retype your password"),
  })
  .refine((data) => data.password === data.reTypePassword, {
    path: ["reTypePassword"], // Points to the retype field
    message: "Passwords do not match",
  });

const SignUp = () => {
  const { mutate, data, error, isPending, isSuccess, isError } =
    useSignUpMutation();

  const [isShowPassword, setIsShowPassword] = useState(false);

  const [showVerifySignUPModal, setShowVerifySignUpModal] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      username: "",
      email: "",
      password: "",
      reTypePassword: "",
    },
  });

  const handleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };

  const onClose = () => {
    setShowVerifySignUpModal(false);
  };

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
      setShowVerifySignUpModal(true);
      return;
    }
  }, [data, error, isError, isSuccess]);

  return (
    <GridWrapper>
      <div className="container mx-auto h-dvh flex flex-col w-full items-center justify-center px-4 sm:px-0 relative">
        <div className="z-10 w-full flex flex-col items-center ">
          <h1 className="mb-10 text-center font-medium">
            <span className="text-orange-400 font-bold text-2xl">
              Hi User!{" "}
            </span>
            Create An Account
          </h1>

          <div className="w-full max-w-lg border p-4 py-8 rounded-lg bg-white">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="  flex flex-col gap-8"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="username"
                          {...field}
                          className="py-5"
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
                    <FormItem className="relative">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email"
                          {...field}
                          type="email"
                          className="py-5"
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <ShowPassword
                        fn={handleShowPassword}
                        isShowPassword={isShowPassword}
                      />

                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="password"
                          {...field}
                          type={isShowPassword ? "text" : "password"}
                          className="py-5"
                          autoComplete="off"
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
                    <FormItem className="relative">
                      <ShowPassword
                        fn={handleShowPassword}
                        isShowPassword={isShowPassword}
                      />

                      <FormLabel>Re-Type Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="re-type password"
                          {...field}
                          type={isShowPassword ? "text" : "password"}
                          autoComplete="off"
                          className="py-5"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" type="submit" disabled={isPending}>
                  {isPending ? <Spinner /> : "Sign Up"}
                </Button>
              </form>
            </Form>
            <div className="mt-10 text-center">
              Already have an Account?{" "}
              <Link to={"/sign-in"} className="text-orange-500">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      {showVerifySignUPModal && <VerifySignUpModal onClose={onClose} />}
    </GridWrapper>
  );
};

export default SignUp;
