'use client'

import { Suspense } from "react";
import Game from "./game";


// useSearchParams is required to be wrapped in Suspense
export default function Page() {
  return (
    <Suspense>
      <Game />
    </Suspense>
  );
}