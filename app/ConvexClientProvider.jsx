"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined");
}
const convex = new ConvexReactClient(convexUrl);
function ConvexClientProvider({children}) {
  return (
   <ConvexProvider client={convex}>{children}</ConvexProvider>
  )
}

export default ConvexClientProvider