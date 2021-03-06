import { ReactElement } from "react";

export default function Title(): ReactElement {
  // Title with slogan
  return (
    <>
      <span className="text-black dark:text-white font-title font-bold text-4xl md:text-6xl pt-1">
    TurboFile
      </span>
      <span className="
    text-black dark:text-white font-slogan text-lg
    self-end pb-4 whitespace-nowrap hidden lg:block"
      >
    Instant file sharing
      </span>
    </>
  );
}
