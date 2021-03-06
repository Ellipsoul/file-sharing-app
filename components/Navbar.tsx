import { ReactElement } from "react";
import AppBar from "@mui/material/AppBar";

import Title from "./Navbar_Components/Title";
import Actions from "./Navbar_Components/Actions";

export default function Navbar(): ReactElement {
  // Divide navbar into title and action buttons
  return (
    <AppBar position="static" className="
      flex flex-row items-center justify-between gap-x-3 md:gap-x-6 relative
      h-20 md:h-24 pl-6 pr-4 md:pl-10 md:pr-10 bg-slate-100 dark:bg-slate-900
    ">
      <Title />
      <div className="grow" /> {/* Separates title from buttons */}
      <Actions />
    </AppBar>
  );
}
