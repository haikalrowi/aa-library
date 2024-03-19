"use server";

import { revalidatePath } from "next/cache";
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

async function adminCheckOrThrow() {
  const isAdmin = await adminIsAdmin();
  if (!isAdmin) {
    throw new Error("Not an admin");
  }
}

export async function adminCreateBook(formData: FormData) {
  try {
    await adminCheckOrThrow();
    await prisma.book.create({
      data: {
        isbn: parseInt(formData.get("isbn") as string),
        title: formData.get("title") as string,
        author: formData.get("author") as string,
      },
    });
  } catch (error) {
    console.error(error);
  }
  revalidatePath("/admin");
}

export async function adminUpdateBook(formData: FormData) {
  try {
    await adminCheckOrThrow();
    await prisma.book.update({
      data: {
        isbn: parseInt(formData.get("isbn") as string),
        title: formData.get("title") as string,
        author: formData.get("author") as string,
      },
      where: { id: formData.get("id") as string },
    });
  } catch (error) {
    console.error(error);
  }
  revalidatePath("/admin");
}
