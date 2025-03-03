import React, { useState } from "react";
import { Board } from "./Board";
import { DropDown } from "./DropDown";


export type level =
    'Easy' | 'Medium' | 'Hard';


export const GameMngr: React.FC = () => {
    const [difficulty, setDifficulty] = useState<level>('Medium');

    const onAction = (val: level) => {
        console.log(val);
        setDifficulty(val);
    }

    return (
        <div>
            <h1>{difficulty}</h1>
            <DropDown onAction={() => onAction} difficulty={difficulty} />
            <Board difficulty={difficulty} />
        </div>
    );
}