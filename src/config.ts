import { z } from "zod";

const configSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_URL: z.string(),
  NEXT_PUBLIC_BANK_NAME: z.string(),
  NEXT_PUBLIC_ACC: z.string(),
  NEXT_PUBLIC_OWNER_NAME: z.string(),
  NEXT_PUBLIC_CONTENT: z.string(),
  NEXT_PUBLIC_BANK_NAME_SHORT: z.string(),
});

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  NEXT_PUBLIC_BANK_NAME: process.env.NEXT_PUBLIC_BANK_NAME,
  NEXT_PUBLIC_ACC: process.env.NEXT_PUBLIC_ACC,
  NEXT_PUBLIC_OWNER_NAME: process.env.NEXT_PUBLIC_OWNER_NAME,
  NEXT_PUBLIC_CONTENT: process.env.NEXT_PUBLIC_CONTENT,
  NEXT_PUBLIC_BANK_NAME_SHORT: process.env.NEXT_PUBLIC_BANK_NAME_SHORT,
});

if (!configProject.success) {
  console.log(configProject.error.errors);
  throw new Error("Các khai báo biến môi trường không hợp lệ");
}

const envConfig = configProject.data;
export default envConfig;
