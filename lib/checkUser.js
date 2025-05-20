import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { cache } from 'react';

// Cache the user lookup for 1 minute
export const checkUser = cache(async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    try {
      const loggedInUser = await db.user.findUnique({
        where: {
          clerkUserId: user.id,
        },
        include: {
          industryInsight: true // Include the related industry data
        }
      });

      if (loggedInUser) {
        return loggedInUser;
      }

      const name = `${user.firstName} ${user.lastName}`;

      const newUser = await db.user.create({
        data: {
          clerkUserId: user.id,
          name,
          imageUrl: user.imageUrl,
          email: user.emailAddresses[0].emailAddress,
        },
        include: {
          industryInsight: true
        }
      });

      return newUser;
    } catch (dbError) {
      console.error("Database error in checkUser:", dbError);
      throw new Error(`Database operation failed: ${dbError.message}`);
    }
  } catch (error) {
    console.error("Error in checkUser:", error);
    throw error;
  }
});
