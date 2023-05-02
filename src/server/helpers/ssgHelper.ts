
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from "y/server/api/root";
import {prisma} from "y/server/db";
import superjson from "superjson";
export const generateSSGHelper = () => createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });