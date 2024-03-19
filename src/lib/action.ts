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
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
}

export async function adminLogin(formData: FormData) {
  let token;
  try {
    const admin = await prisma.admin.findUniqueOrThrow({
      where: {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
      },
    });
    token = await sign({ id: admin.id });
  } catch (error) {
    console.error(error);
    return;
  }
  cookies().set("token", token);
}

export async function adminLogout() {
  cookies().delete("token");
}
