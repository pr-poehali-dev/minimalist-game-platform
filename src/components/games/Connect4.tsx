import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { type GameRoom, updateRoomState, getRoom, isHost } from '@/lib/gameRoom';

type Player = 1 | 2 | null;

const ROWS = 6;
const COLS = 7;

interface Connect4Props {
  room?: GameRoom;
}

const Connect4 = ({ room }: Connect4Props) => {
  const [board, setBoard] = useState<Player[][]>(
    Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  const isMultiplayer = !!room;
  const playerIsHost = room ? isHost(room) : false;
  const playerNumber = playerIsHost ? 1 : 2;
  const isPlayerTurn = isMultiplayer
    ? currentPlayer === playerNumber
    : true;

  useEffect(() => {
    if (!room) return;

    const interval = setInterval(() => {
      const updatedRoom = getRoom(room.id);
      if (updatedRoom && updatedRoom.gameState) {
        setBoard(updatedRoom.gameState.board || Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
        setCurrentPlayer(updatedRoom.currentTurn === 'host' ? 1 : 2);
        setWinner(updatedRoom.gameState.winner || null);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [room]);

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
    if (isMultiplayer && !isPlayerTurn) return;

    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        const newBoard = board.map((r) => [...r]);
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        
        const nextPlayer = currentPlayer === 1 ? 2 : 1;
        setCurrentPlayer(nextPlayer);

        const gameWinner = checkWinner(newBoard);
        if (gameWinner) {
          setWinner(gameWinner);
        }

        if (room) {
          const nextTurn = playerIsHost ? 'guest' : 'host';
          updateRoomState(room.id, { board: newBoard, winner: gameWinner }, nextTurn);
        }
        break;
      }
    }
  };

  const resetGame = () => {
    const emptyBoard = Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(null));
    setBoard(emptyBoard);
    setCurrentPlayer(1);
    setWinner(null);
    setHoveredCol(null);

    if (room) {
      updateRoomState(room.id, { board: emptyBoard, winner: null }, 'host');
    }
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
        <div className="flex items-center justify-between">
          <CardTitle>4 в ряд</CardTitle>
          {isMultiplayer && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              {playerIsHost ? 'Хозяин' : 'Гость'} (Игрок {playerNumber})
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            {winner ? (
              <div className="text-xl font-semibold">
                {winner === 'Draw' ? (
                  <span className="text-muted-foreground">Ничья!</span>
                ) : (
                  <span className="text-primary">
                    {isMultiplayer
                      ? winner === playerNumber
                        ? 'Вы победили!'
                        : 'Противник победил!'
                      : `Победил игрок ${winner}!`}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-lg text-muted-foreground">
                {isMultiplayer ? (
                  isPlayerTurn ? (
                    <span className="font-bold text-primary">Ваш ход</span>
                  ) : (
                    <span>Ход противника...</span>
                  )
                ) : (
                  <>
                    Ход игрока: <span className="font-bold text-primary">{currentPlayer}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {isMultiplayer && !isPlayerTurn && !winner && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Ожидание хода противника...</span>
            </div>
          )}

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
                      !winner && board[0][col] === null && isPlayerTurn
                        ? 'hover:bg-primary/30 cursor-pointer'
                        : 'cursor-default opacity-50'
                    }`}
                    disabled={!!winner || board[0][col] !== null || (isMultiplayer && !isPlayerTurn)}
                  >
                    {hoveredCol === col && !winner && board[0][col] === null && isPlayerTurn && (
                      <Icon name="ChevronDown" size={20} className="mx-auto text-primary" />
                    )}
                  </button>
                ))}

              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const isPreview =
                    hoveredCol === colIndex &&
                    !winner &&
                    isPlayerTurn &&
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
