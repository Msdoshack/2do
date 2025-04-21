import TodoHeader from "./TodoHeader";
import { Input } from "./ui/input";
import ReactQuill from "react-quill-new";
import { Button } from "./ui/button";
import "react-quill-new/dist/quill.snow.css";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useAddTodo } from "../tanstack/mutation/todo/mutation";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/user/userSlice";

const formSchema = z.object({
  title: z.string().min(1, "please provide a title"),
  description: z.string().min(1, "please provide a description"),

  reminderInterval: z
    .string()
    .min(1, "please provider preferred reaminder interval"),

  // deadline: z
  //   .union([z.string(), z.date()])

  //   .refine((val) => !isNaN(new Date(val).getTime()), {
  //     message: "Invalid date format",
  //   })
  //   .transform((val) => new Date(val))
  //   .optional(),
});

const AddTodoComponent = () => {
  const { user } = useSelector(selectUser);
  const { mutate, data, isError, isSuccess, error } = useAddTodo();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      reminderInterval: "",
      // deadline: undefined,
    },
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate({ ...values, token: user.token });
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
          return;
        }
      }
    }
    if (isSuccess) {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      navigate(`/dashboard?page=single-todo&todoId=${data.data._id}`);
    }
  }, [isError, isSuccess, data]);
  return (
    <div className="my-10 mx-4 lg:mx-16">
      <TodoHeader title="Add New Task" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8 my-16"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="title" {...field} className="py-5" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={() => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Controller
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                      <ReactQuill
                        className="h-80"
                        theme="snow"
                        placeholder="Enter description or steps of how you intend to get task done"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={() => form.trigger("description")}
                      />
                    )}
                  />
                </FormControl>
                <FormMessage className="mt-2" />
              </FormItem>
            )}
          />

          {/* <FormField
            name="deadline"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mt-10">
                <FormLabel>Select a deadline</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a Date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            name="reminderInterval"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mt-12">
                <FormLabel>Set a reminder</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Remainder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit">Add Todo</Button>
        </form>
      </Form>
    </div>
  );
};

export default AddTodoComponent;
