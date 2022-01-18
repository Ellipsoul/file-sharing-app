import { ReactElement } from "react";

export default function About(): ReactElement {
  return (
    <main className='grow flex flex-row justify-evenly items-center flex-wrap gap-x-5 gap-y-5'>
      <div className="w-96 h-64 border border-green-400">
        This is where the about page should go
      </div>
      <div className="w-96 h-64 border border-green-400">
        This is where the about page should go
      </div>
      <div className="w-96 h-64 border border-green-400">
        This is where the about page should go
      </div>
      <div className="w-96 h-64 border border-green-400">
        This is where the about page should go
      </div>
    </main>
  );
}
