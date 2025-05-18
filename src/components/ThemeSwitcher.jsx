import {useTheme} from "next-themes";
import {Switch} from "@heroui/react";
import {MoonIcon} from "../assets/MoonIcon.jsx";
import {SunIcon} from "../assets/SunIcon.jsx";

const SwitchTheme = () => {
    const { resolvedTheme, setTheme } = useTheme();


    return (
        <div>
            <Switch
                endContent={<MoonIcon />}
                startContent={<SunIcon />}
                color="secondary"
                isSelected={resolvedTheme === 'dark'}
                onValueChange={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            />
        </div>
    );
};

export default SwitchTheme;