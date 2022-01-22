import { ReactElement } from "react";
import Image from "next/image";

export default function About(): ReactElement {
  return (
    <main className='
      grow flex flex-col md:flex-row justify-between items-stretch gap-x-5 gap-y-5 md:px-10'>
      <div className="about-containers">
        <Image
          src={"logo.png"}
          alt='TurboFile Logo'
          quality={100}
          width={200}
          height={200}
        />
      </div>
      <div className="about-containers">
        <Image
          src={"logo.png"}
          alt='TurboFile Logo'
          quality={100}
          width={200}
          height={200}
        />
      </div>
      <div className="about-containers">
        <Image
          src={"logo.png"}
          alt='TurboFile Logo'
          quality={100}
          width={200}
          height={200}
        />
      </div>

    </main>
  );
}
