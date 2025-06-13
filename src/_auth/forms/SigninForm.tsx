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
import { SigninValidationSchema } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { toast, useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { useSignInAccount } from "@/lib/react-queries/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const popUpMessage = (isUserCreated: boolean) => {
  if (isUserCreated) {
    return toast({
      title: "Signed in successfully",
      description: "Welcome Back!",
    });
  } else {
    return toast({
      variant: "destructive",
      title: "Sign in failed, Please try again",
      description: "There was a problem with your request.",
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    });
  }
};

const SigninForm = () => {
  const { toast } = useToast();
  const { mutateAsync: signInAccount } = useSignInAccount();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();
  //createUserAccount is an alias name for mutateAsync, isCreatingAccount is an alias name for isLoading
  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidationSchema>>({
    resolver: zodResolver(SigninValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidationSchema>) {
    console.log("trying to sign in");
    try {
      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });
      if (!session) {
        popUpMessage(false);
      } else {
        popUpMessage(true);
      }
    } catch (error) {
      popUpMessage(false);
      console.log(error);
    }

    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      popUpMessage(false);
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col sm:w-420 p-6">
        <div className="flex justify-center">
          <img src="assets/images/BP-logo.svg" alt="logo" className="w-70" />
        </div>
        <h2 className="h3-bold md:h2-bold sm:pt-3">Sign in to your account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back to BadrPics! Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gab-5 w-full mt-4"
        >
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
            {isUserLoading ? (
              <div className="flex items-center gap-2">
                <Loader />
                <div>Loading....</div>
              </div>
            ) : (
              <div>Sign In</div>
            )}
          </Button>
          <p className="text-light-2 text-small-regular mt-2 text-center">
            Don't have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
