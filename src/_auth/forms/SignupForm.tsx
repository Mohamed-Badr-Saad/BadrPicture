//external imports
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

//local imports
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignupValidationSchema } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { toast, useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import {
  useCreateUserAccountMutation,
  useSignInAccount,
} from "@/lib/react-queries/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const popUpMessage = (isUserCreated: boolean) => {
  if (isUserCreated) {
    toast({
      title: "User created successfully",
      description: "You can now log in to your account",
      action: <ToastAction altText="Try again">Log in</ToastAction>,
    });
  } else {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    });
  }
};

const SignupForm = () => {
  const { toast } = useToast();
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccountMutation();
  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccount();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();
  //createUserAccount is an alias name for mutateAsync, isCreatingAccount is an alias name for isLoading
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidationSchema>>({
    resolver: zodResolver(SignupValidationSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidationSchema>) {
    try {
      const newUser = await createUserAccount(values);
      console.log(newUser);
      console.log("new user added");
      if (!newUser) {
        popUpMessage(false);
      } else {
        popUpMessage(true);
      }
    } catch (error) {
      popUpMessage(false);
      console.log(error);
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    if (!session) {
      return toast({
        variant: "destructive",
        title: "Sign in failed, Please try again",
      });
    }
    const isLoggedIn = await checkAuthUser();
    console.log(isLoggedIn);
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({
        variant: "destructive",
        title: "Sign in failed, Please try again",
      });
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col sm:w-420  p-6">
        <div>
          <img src="assets/images/BP-logo.svg" alt="logo" />
        </div>
        <h2 className="h3-bold md:h2-bold sm:pt-3">Create a new account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use BadrPics, Please enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gab-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary mt-4">
            {isCreatingAccount ? (
              <div className="flex items-center gap-2">
                <Loader />
                <div>Loading....</div>
              </div>
            ) : (
              <div>Sign Up</div>
            )}
          </Button>
          <p className="text-light-2 text-small-regular mt-2 text-center">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
