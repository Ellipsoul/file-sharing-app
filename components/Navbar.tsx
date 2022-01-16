import React, { ReactElement } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useLoaded } from "../hooks/Loaded";

import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Divider from "@mui/material/Divider";

export default function Navbar(): ReactElement {
  // Handle theme in top navigation bar
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const loaded = useLoaded(); // Custom hook to check if the page is loaded

  return (
    <AppBar position="static" className="
      flex flex-row items-center justify-between gap-x-6
      h-24 px-10 bg-slate-50 dark:bg-slate-800
    ">
      {/* Title and Slogan */}
      <span className="text-black dark:text-white font-title font-bold text-6xl">TurboFile</span>
      <span className="
        text-black dark:text-white font-slogan text-lg self-end pb-4 whitespace-nowrap"
      >
        One-drag file sharing
      </span>

      {/* Separates title from buttons */}
      <div className="grow"></div>

      {/* Main dashbaord page */}
      <Link href="/dashboard">
        <Button
          className="
          button-background px-4 py-2 rounded-xl flex flex-col
          bg-slate-700 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-slate-100"
          variant="contained"
          color="primary">
          <DashboardRoundedIcon className="text-slate-100 dark:text-slate-800" />
          <span className="text-white dark:text-slate-800">Dashboard</span>
        </Button>
      </Link>
      {/* Link to About Page */}
      <Link href="/about">
        <Button
          className="
          button-background px-4 py-2 rounded-xl flex flex-col
          bg-slate-700 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-slate-100"
          variant="contained"
          color="primary">
          <InfoRoundedIcon className="text-slate-100 dark:text-slate-800" />
          <span className="text-white dark:text-slate-800">About</span>
        </Button>
      </Link>

      {/* Separates the naviation linkes from the theme toggler */}
      <Divider
        orientation="vertical"
        flexItem
        variant="middle"
        className="bg-slate-800 dark:bg-white" />

      {/* Theme toggler */}
      <Button
        className="
          button-background p-4 rounded-full
          bg-slate-700 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-slate-100"
        variant="contained"
        color="primary"
        onClick={toggleTheme}
        size="large">
        {loaded && theme === "light" ?
          <LightModeRoundedIcon fontSize="large" /> :
          <DarkModeRoundedIcon className="text-slate-800" fontSize="large" />}
      </Button>

    </AppBar>
  );
}
