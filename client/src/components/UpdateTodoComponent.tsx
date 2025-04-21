import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import ReactQuill from "react-quill-new";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "../lib/utils";
import { TodoType } from "../types";
import { useUpdateTodo } from "../tanstack/mutation/todo/mutation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "./Spinner";

const formSchema = z.object({
  title: z.string().min(1, "please provide a title"),
  description: z.string().min(1, "please provide a description"),

  reminderInterval: z
    .string()
    .min(1, "please provider preferred reaminder interval"),

  deadline: z
    .union([z.string(), z.date()])

    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val))
    .optional(),
  isDone: z.coerce.boolean(),
});

type PropsType = {
  data: TodoType;
  onClose: () => void;
};

const UpdateTodoComponent = ({ data, onClose }: PropsType) => {
  const {
    mutate,
    data: updateTodoData,
    error,
    isError,
    isPending,
    isSuccess,
  } = useUpdateTodo();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data.title,
      description: data.description,
      reminderInterval: data.reminderInterval,
      deadline: data.deadline,
      isDone: data.isDone,
    },
  });
  const queryClient = useQueryClient();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate({ data: values, todoId: data._id });
  };

  useEffect(() => {
    if (isError) {
      toast.error(error.response.data.error);
      return;
    }
    if (isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["todo", { todoId: data._id }],
      });
      onClose();
      toast.success(updateTodoData.message);
    }
  }, [isError, isSuccess, updateTodoData]);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 my-5"
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
                      className="h-48"
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

        <FormField
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
        />

        <FormField
          name="reminderInterval"
          control={form.control}
          render={({ field }) => (
            <FormItem>
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

        <FormField
          name="isDone"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  defaultValue={String(field.value)}
                  onValueChange={(val) => field.onChange(val === "true")}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Active</SelectItem>
                    <SelectItem value="true">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between w-full px-10">
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : "Update Todo"}
          </Button>

          <Button
            className="text-red-500 "
            variant={"outline"}
            type="submit"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateTodoComponent;
