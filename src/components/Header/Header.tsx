import clsx from "clsx";
import styles from "./Header.module.scss";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { useToggle } from "@/hooks/useToggle";
import { MenuHeader } from "../ui/MenuHeader/MenuHeader";
import { Logo } from "../ui/Logo/Logo";
import { Authorization } from "../ui/Authorization/Authorization";

export default function Header() {
  const widthWindow = useWindowWidth();
  const [isActiveDropdown, toggleDropdown, closeDropdown] = useToggle(false);
  const [isActiveAuth, toggleAuth, closeAuth] = useToggle(false);

  return (
    <header className={clsx(styles.wrapper)}>
      <div className={clsx(styles.container, "container")}>
        <div className={clsx(styles.block)}>
          <Logo widthWindow={widthWindow} />
          <MenuHeader
            widthWindow={widthWindow}
            isActiveDropdown={isActiveDropdown}
            toggleDropdown={toggleDropdown}
            closeDropdown={closeDropdown}
          />
        </div>
        <Authorization
          widthWindow={widthWindow}
          isActiveAuth={isActiveAuth}
          toggleAuth={toggleAuth}
          closeAuth={closeAuth}
        />
      </div>
    </header>
  );
}
