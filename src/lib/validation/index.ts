import { z } from "zod";

export const SignupValidationSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const SigninValidationSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const PostValidationSchema = z.object({
  caption: z
    .string()
    .min(5, { message: "caption must be at least 5 characters long" })
    .max(2200, { message: "caption must be at most 2200 characters long" }),
    file: z.custom<File[]>(),
  location: z
    .string()
    .min(2, { message: "location must be at least 2 characters long" })
    .max(100, { message: "location must be at most 100 characters long" }),
  tags: z.string(),
});


export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});