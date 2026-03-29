import React from "react";
import './checkbox.scss';

type Props = Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>,HTMLInputElement>,'value'> & {
    value: boolean;
};

export const Checkbox: React.FunctionComponent<Props> = ({name,id,children,className,value,onClick,...props}) => {
    return (
        <div className={`checkbox-wrapper  ${className}`}>
            <div className="text">{children}</div>
            <input className={`${value === true ? "checked blur-background" : ""}`} type="checkbox" onClick={onClick} name={name} id={id ? id : name} {...props} />
        </div>
    );
};