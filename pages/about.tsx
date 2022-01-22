import { ReactElement } from "react";
import Image from "next/image";

export default function About(): ReactElement {
  return (
    <main className='grow flex flex-row justify-evenly items-center flex-wrap gap-x-5 gap-y-5'>
      <Image
        src='/logo.png'
        alt='TurboFile Logo'
        quality={100}
        width={200}
        height={200}
      />
    </main>
  );
}
