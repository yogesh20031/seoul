import { Prisma } from "@prisma/client";
import type { AuthResponse, LoginInput, RegisterInput } from "@seoul/shared";
import { HttpError, unauthorized } from "../../lib/http-error";
import { signToken } from "../../lib/jwt";
import { toAuthUser } from "../../lib/mappers";
import { hashPassword, verifyPassword } from "../../lib/password";
import { prisma } from "../../lib/prisma";

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing)
    throw new HttpError(
      409,
      "EMAIL_TAKEN",
      "An account with this email already exists",
    );

  try {
    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash: await hashPassword(input.password),
        name: input.name,
        role: input.role,
        locale: input.locale,
        ...(input.role === "GUIDE"
          ? {
              guideProfile: {
                create: {
                  languages: [input.locale === "ko" ? "Korean" : "English"],
                  specialties: [],
                },
              },
            }
          : {}),
      },
    });
    return {
      token: signToken({ userId: user.id, role: user.role }),
      user: toAuthUser(user),
    };
  } catch (err) {
    // Two simultaneous sign-ups with the same email both pass the check above.
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw new HttpError(
        409,
        "EMAIL_TAKEN",
        "An account with this email already exists",
      );
    }
    throw err;
  }
};

export const login = async (input: LoginInput): Promise<AuthResponse> => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  const valid = user
    ? await verifyPassword(input.password, user.passwordHash)
    : false;
  if (!user || !valid)
    throw new HttpError(
      401,
      "INVALID_CREDENTIALS",
      "Invalid email or password",
    );
  return {
    token: signToken({ userId: user.id, role: user.role }),
    user: toAuthUser(user),
  };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw unauthorized();
  return toAuthUser(user);
};
