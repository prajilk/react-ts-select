import { Select, SelectOption } from "./Select";
import { useState } from "react";

const options = [
    { value: 1, label: "One" },
    { value: 2, label: "Two" },
    { value: 3, label: "Three" },
    { value: 4, label: "Four" },
    { value: 5, label: "Five" },
];

function App() {
    const [value1, setValue1] = useState<SelectOption[]>([options[0]]);
    const [value2, setValue2] = useState<SelectOption | undefined>(options[0]);

    return (
        <>
            <h1>React + TS Select</h1>
            <p>Multi-Select</p>
            <Select
                multiple
                options={options}
                value={value1}
                onChange={(o) => setValue1(o)}
            />
            <br />
            <p>Single-Select</p>
            <Select
                options={options}
                value={value2}
                onChange={(o) => setValue2(o)}
            />
        </>
    );
}

export default App;
