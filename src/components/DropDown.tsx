import React, { useState } from "react";
import { level } from "./GameMngr";



type Callback = (val: level) => void;

type DropDownProps = {
    onAction: () => Callback;
    difficulty: level;
}

export const DropDown: React.FC<DropDownProps> = ({ onAction }) => {
    const [bottomClicked, setBottomClicked] = useState(false);
    return (
        <div className="dropDoewn">
            <button onClick={() => setBottomClicked(!bottomClicked)}>^</button>
            {
                bottomClicked && <ul>
                    <li onClick={() => {const fun = onAction(); fun('Easy');}}>Easy</li>
                    <li onClick={() => {const fun = onAction(); fun('Medium');}}>Medium</li>
                    <li onClick={() =>  {const fun = onAction(); fun('Hard');}}>Hard</li>
                </ul>
            }
        </div>
    )


}