import { jwtVerify, SignJWT } from "jose";

import { Admin } from "@prisma/client";

type Payload = Partial<Admin>;

const alg = "HS256";
const key = new TextEncoder().encode(process.env.SECRET);

export async function sign(payload: Payload) {
  const signJWT = new SignJWT(payload);

  return signJWT.setProtectedHeader({ alg }).sign(key);
}

export async function verify(jwt: string) {
  const { payload } = await jwtVerify<Payload>(jwt, key);

  return payload;
}
