"use server"

// import bcrypt from "bcrypt"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import prisma from "@/lib/prisma"

// Define validation schema
const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export async function register(formData) {
  try {
    // Extract and validate form data
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    }

    // Validate data
    const validatedData = registerSchema.safeParse(data)
    if (!validatedData.success) {
      return { success: false, errors: validatedData.error.flatten().fieldErrors }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return { success: false, errors: { email: ["Email already in use"] } }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12)

    // Create user
    await prisma.user.create({
      data: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        hashedPassword,
      },
    })

    revalidatePath("/auth/login")
    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, errors: { _form: ["An unexpected error occurred"] } }
  }
}

// Define login schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function login(formData) {
  try {
    // Extract and validate form data
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    }

    // Validate data
    const validatedData = loginSchema.safeParse(data)
    if (!validatedData.success) {
      return { success: false, errors: validatedData.error.flatten().fieldErrors }
    }

    // Authentication is handled by NextAuth
    // This function is just for form validation
    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, errors: { _form: ["An unexpected error occurred"] } }
  }
}

