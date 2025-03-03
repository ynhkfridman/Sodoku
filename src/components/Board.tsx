import React, { useEffect, useState } from "react";
import { level } from "./GameMngr";
import "./Board.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




type BoardProps = {
    //onAction : Callback;
    difficulty: level;
}

export const Board: React.FC<BoardProps> = ({ difficulty }) => {
    const high: number = 8;
    const low: number = 0;
    const squareSize: number = 3;
    const [previousValue, setPreviousValue] = useState<number>(0);
    const [initialBoard, setInitialBoard] = useState<number[][]>();
    const [board, setBoard] = useState<number[][]>([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);

    useEffect(() => {
        console.log('Updated board:', board);
    }, [board]);

    useEffect(() => {
        console.log("mount");
        const fetchData = async () => {
            try {
                const response = await fetch(`https://sudoku-api.vercel.app/api/dosuku`);
                console.log(response);
                const text = await response.text();
                //console.log('Raw Response:', text);
                const data = JSON.parse(text);
                console.log(data.newboard.grids[0].value[1]);
                console.log(data?.newboard?.grids?.length);
                if (data?.newboard?.grids?.length > 0) {
                    console.log("hi");
                    const fetchedBoard = data.newboard.grids[0].value.map((row: number[]) => { return [...row]; });
                    console.log(initialBoard);
                    setInitialBoard(fetchedBoard);
                    setBoard(fetchedBoard);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [difficulty]);

    function getSubGrid(i: number, j: number) {
        return {
            row: Math.floor(i / squareSize),
            col: Math.floor(j / squareSize)
        };
    };

    function areInSameSubGrid(i1: number, j1: number, i2: number, j2: number): boolean {
        const subGrid1 = getSubGrid(i1, j1);
        const subGrid2 = getSubGrid(i2, j2);

        return subGrid1.row === subGrid2.row && subGrid1.col === subGrid2.col;
    };


    const isItLegal = (i: number, j: number, val: number): Boolean => {
        if (i > high || i < low || j > high || j < low) return false;
        let count = 0;
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                count++;
                if (board[row][col] == val) {
                    if (col === j || row === i || areInSameSubGrid(i, j, row, col)) {
                        return false;
                    }
                }
            }
        }
        if(count == 81){
            toast.info('ניצחת', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        return true;
    };

    const onClickSquare = (rowIndex: number, colIndex: number, userInput: any) => {
        if (!initialBoard) return;
        console.log(userInput);
        const parsedInput = isNaN(parseInt(userInput, 10)) ? 0 : parseInt(userInput, 10);
        console.log(parsedInput);
        const isInitialValue = initialBoard[rowIndex][colIndex] !== 0;
        if (isInitialValue) {
           toast .error('זה חלק מהחידה המקורית', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if (!isItLegal(rowIndex, colIndex, parsedInput) && parsedInput !== 0) {
            toast.error('זה מתנגש עם מספר אחר בשורה עמודה משבצת', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            const updatedBoard = structuredClone(board);
            updatedBoard[rowIndex][colIndex] = parsedInput;
            setBoard(updatedBoard);
        }
    };



    return (
        <div>
            <ToastContainer />
            {board.map((item, itemIndex) => {
                return <div className="row" key={itemIndex}>{
                    item.map((num, colIndex) => {
                        return <input className="square" key={colIndex} onChange={(event) => {
                            const target = event.target as HTMLElement;
                            const userInput = parseInt((target as HTMLInputElement).value.slice(-1));
                            onClickSquare(itemIndex, colIndex, userInput)
                        }}
                            value={num} />
                    })
                }</div>
            })}
            <p>hi</p>
        </div>
    );
}