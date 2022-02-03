import { ReactElement } from "react";
import Image from "next/image";
import { Button } from "@mui/material";
import Link from "next/link";
import { useTheme } from "next-themes";

// Landing page
export default function About(): ReactElement {
  const { theme } = useTheme();

  return (
    <main className='
      grow flex flex-col md:flex-row justify-evenly items-stretch gap-x-5 gap-y-5 md:px-10'>
      {/* First container has welcome, info and redirect to main app page */}
      <div className="about-containers">
        <Image
          src={"/turbofile-logo.png"}
          alt='TurboFile Logo'
          quality={100}
          width={200}
          height={200}
        />
        <div className="font-heading text-6xl lg:text-7xl text-center w-fit">
            Welcome
        </div>
        <div className="font-serif text-2xl lg:text-4xl text-center w-fit">
          TurboFile is an app that allows you to share large files with anyone in
          just a few clicks.
        </div>
        <div className="font-serif text-2xl lg:text-4xl text-center w-fit">
          No authentication is necessary. Drag, drop, upload and your file is ready to be shared!
        </div>
        <Link href='/app'>
          <Button
            className="
            px-4 py-2 rounded-xl flex flex-row gap-x-3 items-start
          bg-slate-700 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-slate-200"
            variant="contained"
            color="primary"
          >
            <span className="text-white dark:text-slate-800 text-3xl block">
              Start Sharing
            </span>
          </Button>
        </Link>
      </div>
      {/* Second container has information about me and external links */}
      <div className="about-containers justify-evenly">
        <div className="font-serif text-2xl lg:text-4xl text-center w-fit">
          Hi! I am Aron Teh.
        </div>
        <div className="font-serif text-2xl lg:text-4xl text-center w-fit">
          I build small projects like this in my free time to learn and explore new technologies.
        </div>
        <a href="https://github.com/Ellipsoul/" target="_blank" rel="noreferrer">
          <div className="flex flex-col justify-between items-center gap-y-4">
            <Image
              src={ theme === "light" ? "/github-dark.png" : "/github-light.png" }
              alt='GitHub Logo'
              quality={100}
              width={150}
              height={150}
            />
            <div className="font-heading text-2xl text-center w-fit">
              Source Code
            </div>
          </div>
        </a>
        <a href="https://www.linkedin.com/in/aronteh/file-sharing-app" target="_blank" rel="noreferrer">
          <div className="flex flex-col justify-between items-center gap-y-4">
            <Image
              src={ theme === "light" ? "/linkedin-normal.png" : "/linkedin-white.png" }
              alt='LinkedIn Logo'
              quality={100}
              width={150}
              height={150}
            />
            <div className="font-heading text-2xl text-center w-fit">
              Creator LinkedIn
            </div>
          </div>
        </a>

      </div>

    </main>
  );
}
