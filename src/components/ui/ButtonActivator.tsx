import { Button } from "@mui/material";
import { ReactNode, useState } from "react";

type IProps = {
    Activator: () => ReactNode,
    children: (onClose: () => void) => ReactNode
}

export default function ButtonActivator ({Activator, children}: IProps) {
    const [active, setActive] = useState(false)
    return (
        <div>
            <div onClick={() => setActive(!active)}>
                <Activator />
            </div>
            {active && children(() => setActive(false))}
        </div>
    )
}