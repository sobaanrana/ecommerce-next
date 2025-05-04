"use client";

import { useState } from "react";
import { QueryClient } from "@tanstack/react-query";

// allow use to trpc through out the frontend
const providers = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpcClient.createClient());

  return <div>providers</div>;
};

export default providers;
