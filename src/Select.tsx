import { useEffect, useRef, useState } from "react";
import style from "./styles.module.css";

export type SelectOption = {
    value: string | number;
    label: string;
};

type MultipleProductProps = {
    multiple: true;
    value: SelectOption[];
    onChange: (value: SelectOption[]) => void;
};
type SingleProductProps = {
    multiple?: false;
    value?: SelectOption;
    onChange: (value: SelectOption | undefined) => void;
};

type SelectProps = {
    options: SelectOption[];
} & (MultipleProductProps | SingleProductProps);

export function Select({ multiple, value, onChange, options }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);

    function clearOptions() {
        multiple ? onChange([]) : onChange(undefined);
    }

    function selectOptions(option: SelectOption) {
        if (multiple) {
            if (value.includes(option)) {
                onChange(value.filter((o) => o !== option));
            } else {
                onChange([...value, option]);
            }
        } else {
            if (option !== value) onChange(option);
        }
    }

    function isOptionSelected(option: SelectOption) {
        return multiple ? value.includes(option) : option === value;
    }

    useEffect(() => {
        if (isOpen) setHighlightedIndex(0);
    }, [isOpen]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target != containerRef.current) return;
            switch (e.code) {
                case "Enter":
                case "Space":
                    setIsOpen((prev) => !prev);
                    if (isOpen) selectOptions(options[highlightedIndex]);
                    break;
                case "ArrowUp":
                case "ArrowDown": {
                    if (!isOpen) {
                        setIsOpen(true);
                        break;
                    }
                    const newValue =
                        highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
                    if (newValue >= 0 && newValue < options.length) {
                        setHighlightedIndex(newValue);
                    }
                    break;
                }
                case "Escape":
                    setIsOpen(false);
                    break;
            }
        };
        containerRef.current?.addEventListener("keydown", handler);
        return () => {
            containerRef.current?.removeEventListener("keydown", handler);
        };
    }, [isOpen, highlightedIndex, options]);

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            className={style.container}
            onBlur={() => setIsOpen(false)}
            onClick={() => setIsOpen((prev) => !prev)}
        >
            <span className={style.value}>
                {multiple
                    ? value.map((v) => (
                          <button
                              key={v.value}
                              onClick={(e) => {
                                  e.stopPropagation();
                                  selectOptions(v);
                              }}
                              className={style["option-badge"]}
                          >
                              {v.label}
                              <span className={style["remove-btn"]}>
                                  &times;
                              </span>
                          </button>
                      ))
                    : value?.label}
            </span>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    clearOptions();
                }}
                className={style["clear-btn"]}
            >
                &times;
            </button>
            <div className={style.divider}></div>
            <div className={style.caret}></div>
            <ul className={`${style.options} ${isOpen && style.show}`}>
                {options.map((option, i) => (
                    <li
                        key={i}
                        className={`${style.option} ${
                            isOptionSelected(option) && style.selected
                        } ${i === highlightedIndex && style.highlighted}`}
                        onMouseEnter={() => setHighlightedIndex(i)}
                        onClick={() => {
                            selectOptions(option);
                        }}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}
