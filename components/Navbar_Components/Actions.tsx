import { ReactElement, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useLoaded } from "../../hooks/Loaded";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import FolderSharedRoundedIcon from "@mui/icons-material/FolderSharedRounded";
import MenuIcon from "@mui/icons-material/Menu";
import Divider from "@mui/material/Divider";

export default function Actions(): ReactElement {
  // Handle theme in top navigation bar
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    // closeMenu();
  };

  const loaded = useLoaded(); // Custom hook to check if the page is loaded

  const AppPageButton = () => {
    return (
      <Link href="/app">
        <Button
          className="
      px-4 py-2 rounded-xl hidden tiny:flex flex-col
      bg-slate-700 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-slate-200"
          variant="contained"
          color="primary">
          <FolderSharedRoundedIcon
            className="text-slate-100 dark:text-slate-800 block md:hidden"
            fontSize="large"
          />
          <FolderSharedRoundedIcon
            className="text-slate-100 dark:text-slate-800 hidden md:block"
            fontSize="medium"
          />
          <span className="text-white dark:text-slate-800 hidden md:block text-lg">
        App
          </span>
        </Button>
      </Link>
    );
  };

  const AboutPageButton = () => {
    return (
      <Link href="/about">
        <Button
          className="
          px-4 py-2 rounded-xl hidden tiny:flex flex-col
          bg-slate-700 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-slate-200"
          variant="contained"
          color="primary">
          <InfoRoundedIcon
            className="text-slate-100 dark:text-slate-800 block md:hidden"
            fontSize="large"
          />
          <InfoRoundedIcon
            className="text-slate-100 dark:text-slate-800 hidden md:block"
            fontSize="medium"
          />
          <span className="text-white dark:text-slate-800 text-lg hidden md:block">
            About
          </span>
        </Button>
      </Link>
    );
  };

  const ToggleThemeButton = () => {
    return (
      <Button
        className="
          p-2 md:p-4 rounded-xl md:rounded-full hidden tiny:block
          bg-slate-700 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-slate-200"
        variant="contained"
        color="primary"
        onClick={toggleTheme}
        size="large">
        {loaded && theme === "light" ?
          <LightModeRoundedIcon fontSize="large" /> :
          <DarkModeRoundedIcon className="text-slate-800" fontSize="large" />}
      </Button>
    );
  };

  const ActionsMenu = () => {
    // Handle menu close
    const closeMenu = () => {
      setAnchorEl(null);
    };

    // Anchors the menu so button click opens it
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // Handle menu button click
    const openMenu = (event: any) => {
      setAnchorEl(event.currentTarget);
    };

    return (
      <>
        <Button
          className="rounded-xl md:rounded-full tiny:hidden block"
          variant="text"
          size="large"
          aria-controls={open ? "basic-menu" : undefined}
          aria-expanded={open ? "true": undefined}
          onClick={openMenu}>
          <MenuIcon className="text-slate-800 dark:text-white"/>
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={closeMenu}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <Link href="/app">
            <MenuItem onClick={closeMenu}>App</MenuItem>
          </Link>
          <Link href="/about">
            <MenuItem onClick={closeMenu}>About</MenuItem>
          </Link>
          <MenuItem onClick={toggleTheme}>Toggle Theme</MenuItem>
        </Menu>
      </>
    );
  };

  return (
    <>
      <AppPageButton />
      <AboutPageButton />
      <Divider
        orientation="vertical"
        flexItem
        variant="middle"
        className="bg-slate-800 dark:bg-white hidden tiny:block" />
      <ToggleThemeButton />
      <ActionsMenu />
    </>
  );
}


