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
import { Link, useLocation, useNavigate } from "react-router-dom";
import GridWrapper from "../components/GridWrapper";
import { useSignInMutation } from "../tanstack/mutation/auth/mutation";
import toast from "react-hot-toast";
import { setUser } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import ShowPassword from "../components/ShowPassword";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "please type in registered email address")
    .max(50)
    .email("provide a valid email address"),
  password: z.string().min(1, "Pls type in your password"),
});

const SignIn = () => {
  const { mutate, data, isSuccess, error, isError, isPending } =
    useSignInMutation();
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch();

  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const from = location.state?.from?.pathname || "/dashboard";

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  useEffect(() => {
    if (data && isSuccess) {
      dispatch(setUser(data.data));
      toast.success("Login successful");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      navigate(from, { replace: true });
      return;
    }

    if (isError) {
      if (error) {
        if (error.response.data) {
          toast.error(error?.response?.data?.error);
          return;
        }
        if (error.code && error.code == "ERR_BAD_RESPONSE") {
          toast.error("Server error");
        }
      }
    }
  }, [data, error, isError, isSuccess]);

  return (
    <GridWrapper>
      <div className="container mx-auto h-dvh flex flex-col w-full items-center justify-center px-4 sm:px-0 relative">
        <div className="z-10 w-full flex flex-col items-center">
          <h1 className="mb-10 text-center font-medium">
            <span className="text-orange-400 font-bold text-2xl">
              {" "}
              Welcome Back,{" "}
            </span>
            Login Your Account
          </h1>

          <div className="w-full max-w-lg border p-4 py-8 rounded-lg bg-white">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="  flex flex-col gap-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email"
                          {...field}
                          type="email"
                          className="py-5"
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" type="submit" disabled={isPending}>
                  {isPending ? <Spinner /> : "Login"}
                </Button>
              </form>
            </Form>
            <div className="mt-10 text-center">
              Dont't have an Account?{" "}
              <Link to={"/sign-up"} className="text-orange-500">
                Sign-up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </GridWrapper>
  );
};

export default SignIn;
