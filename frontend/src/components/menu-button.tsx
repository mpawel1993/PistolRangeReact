import {ReactNode} from "react";

interface MenuButtonProps {
    children: ReactNode;
    onClick: () => void;
    className?: string;
    label?: string;
}

export const MenuButton = ({children, onClick, className = "", label}: MenuButtonProps) => (
    <button type="button" className={`menu-button ${className}`} onClick={onClick} aria-label={label}>
        {children}
    </button>
);

export default MenuButton;
