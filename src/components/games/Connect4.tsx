import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type Player = 1 | 2 | null;

const ROWS = 6;
const COLS = 7;

const Connect4 = () => {
  const [board, setBoard] = useState<Player[][]>(
    Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  const checkWinner = (board: Player[][]): Player | 'Draw' | null => {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        const cell = board[row][col];
        if (cell && cell === board[row][col + 1] && cell === board[row][col + 2] && cell === board[row][col + 3]) {
          return cell;
        }
      }
    }

    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS - 3; row++) {
        const cell = board[row][col];
        if (cell && cell === board[row + 1][col] && cell === board[row + 2][col] && cell === board[row + 3][col]) {
          return cell;
        }
      }
    }

    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        const cell = board[row][col];
        if (
          cell &&
          cell === board[row + 1][col + 1] &&
          cell === board[row + 2][col + 2] &&
          cell === board[row + 3][col + 3]
        ) {
          return cell;
        }
      }
    }

    for (let row = 3; row < ROWS; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        const cell = board[row][col];
        if (
          cell &&
          cell === board[row - 1][col + 1] &&
          cell === board[row - 2][col + 2] &&
          cell === board[row - 3][col + 3]
        ) {
          return cell;
        }
      }
    }

    if (board[0].every((cell) => cell !== null)) {
      return 'Draw';
    }

    return null;
  };

  const dropDisc = (col: number) => {
    if (winner || board[0][col] !== null) return;

    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        const newBoard = board.map((r) => [...r]);
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);

        const gameWinner = checkWinner(newBoard);
        if (gameWinner) {
          setWinner(gameWinner);
        }
        break;
      }
    }
  };

  const resetGame = () => {
    setBoard(
      Array(ROWS)
        .fill(null)
        .map(() => Array(COLS).fill(null))
    );
    setCurrentPlayer(1);
    setWinner(null);
    setHoveredCol(null);
  };

  const getLowestEmptyRow = (col: number): number => {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        return row;
      }
    }
    return -1;
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">4 в ряд</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            {winner ? (
              <div className="text-xl font-semibold">
                {winner === 'Draw' ? (
                  <span className="text-muted-foreground">Ничья!</span>
                ) : (
                  <span className="text-primary">Победил игрок {winner}!</span>
                )}
              </div>
            ) : (
              <div className="text-lg text-muted-foreground">
                Ход игрока: <span className="font-bold text-primary">{currentPlayer}</span>
              </div>
            )}
          </div>

          <div className="bg-accent/20 p-4 rounded-lg">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
              {Array(COLS)
                .fill(null)
                .map((_, col) => (
                  <button
                    key={`col-${col}`}
                    onClick={() => dropDisc(col)}
                    onMouseEnter={() => setHoveredCol(col)}
                    onMouseLeave={() => setHoveredCol(null)}
                    className={`h-8 rounded-t-lg transition-colors ${
                      !winner && board[0][col] === null
                        ? 'hover:bg-primary/30 cursor-pointer'
                        : 'cursor-default opacity-50'
                    }`}
                    disabled={!!winner || board[0][col] !== null}
                  >
                    {hoveredCol === col && !winner && board[0][col] === null && (
                      <Icon name="ChevronDown" size={20} className="mx-auto text-primary" />
                    )}
                  </button>
                ))}

              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const isPreview =
                    hoveredCol === colIndex &&
                    !winner &&
                    getLowestEmptyRow(colIndex) === rowIndex;

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="aspect-square rounded-full border-2 border-border bg-card flex items-center justify-center"
                    >
                      {cell === 1 ? (
                        <div className="w-[70%] h-[70%] rounded-full bg-primary" />
                      ) : cell === 2 ? (
                        <div className="w-[70%] h-[70%] rounded-full bg-accent" />
                      ) : isPreview ? (
                        <div
                          className={`w-[70%] h-[70%] rounded-full opacity-30 ${
                            currentPlayer === 1 ? 'bg-primary' : 'bg-accent'
                          }`}
                        />
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <Button onClick={resetGame} className="w-full" size="lg">
            <Icon name="RotateCcw" size={20} className="mr-2" />
            Начать заново
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Connect4;
