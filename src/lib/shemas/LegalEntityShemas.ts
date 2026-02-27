import { z } from "zod";

export const nameSchema = z
  .string()
  .min(1, "Имя контактного лица обязательно для заполнения");

export const emailSchema = z
  .string()
  .email("Неверный формат email")
  .min(1, "Email обязателен для заполнения");

export const passwordSchema = z
  .string()
  .min(8, "Пароль должен содержать минимум 8 символов")
  .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
  .regex(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву")
  .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру")
  .regex(/[\W_]/, "Пароль должен содержать хотя бы один спецсимвол")
  .min(1, "Пароль обязателен");

export const phoneSchema = z
  .string()
  .regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, "Неверный формат номера телефона")
  .min(1, "Номер телефона обязателен для заполнения");

export const innSchema = z
  .string()
  .regex(/^\d{10}$|^\d{12}$/, "ИНН должен содержать 10 цифр")
  .min(1, "ИНН обязателен для заполнения");

export const legalEntityFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
  inn: innSchema,
});

export type LegalEntityFormData = z.infer<typeof legalEntityFormSchema>;
