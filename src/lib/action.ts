"use server";

import ms from "ms";
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

const adminPath = "/admin";

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
  revalidatePath(adminPath);
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
  revalidatePath(adminPath);
}

export async function adminDeleteBook(formData: FormData) {
  try {
    await adminCheckOrThrow();
    await prisma.book.delete({ where: { id: formData.get("id") as string } });
  } catch (error) {
    console.error(error);
  }
  revalidatePath(adminPath);
}

export async function adminCreateCopy(formData: FormData) {
  try {
    await adminCheckOrThrow();
    await prisma.copy.create({
      data: {
        bookId: formData.get("bookId") as string,
        serial: formData.get("serial") as string,
      },
    });
  } catch (error) {
    console.error(error);
  }
  revalidatePath(adminPath);
}

export async function adminUpdateCopy(formData: FormData) {
  try {
    await adminCheckOrThrow();
    await prisma.copy.update({
      data: {
        serial: formData.get("serial") as string,
      },
      where: { id: formData.get("id") as string },
    });
  } catch (error) {
    console.error(error);
  }
  revalidatePath(adminPath);
}

export async function adminDeleteCopy(formData: FormData) {
  try {
    await adminCheckOrThrow();
    await prisma.copy.delete({ where: { id: formData.get("id") as string } });
  } catch (error) {
    console.error(error);
  }
  revalidatePath(adminPath);
}

export async function adminCreateCheckout(formData: FormData) {
  try {
    await adminCheckOrThrow();
    const checkout = await prisma.checkout.create({
      data: {
        studentId: formData.get("studentId") as string,
        copyId: formData.get("copyId") as string,
        dueDate: new Date(Date.now() + ms("1 week")),
      },
    });
    await prisma.copy.update({
      data: { available: false },
      where: { id: checkout.copyId },
    });
  } catch (error) {
    console.error(error);
  }
  revalidatePath(adminPath);
}

export async function adminReturnCheckout(formData: FormData) {
  try {
    await adminCheckOrThrow();
    const checkout = await prisma.checkout.update({
      data: { returned: true },
      where: { id: formData.get("id") as string },
    });
    await prisma.copy.update({
      data: { available: true },
      where: { id: checkout.copyId },
    });
  } catch (error) {
    console.error(error);
  }
  revalidatePath(adminPath);
}
