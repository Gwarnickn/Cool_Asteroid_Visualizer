import React,{type FunctionComponent} from "react";
import "./button.scss";

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    className?: string
};

const Button: FunctionComponent<ButtonProps> = ({children, className, onClick, ...props}) =>{
    return (
        <button className={`button ${className} blur-background`} onClick={onClick} {...props}>{children}</button>
    );
}
export default Button;