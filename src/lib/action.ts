"use server";

import { cookies } from "next/headers";

import { sign, verify } from "./jose";
import prisma from "./prisma";

export async function adminIsAdmin() {
  const token = cookies().get("token")?.value;
  try {
    if (!token) {
      throw new Error("No token found");
    }
    const { id } = await verify(token);
    await prisma.admin.findUniqueOrThrow({ where: { id } });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function adminLogin(formData: FormData) {
  const admin = await prisma.admin.findUniqueOrThrow({
    where: {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    },
  });
  const token = await sign({ id: admin.id });
  cookies().set("token", token);
}

export async function adminLogout() {
  cookies().delete("token");
}
