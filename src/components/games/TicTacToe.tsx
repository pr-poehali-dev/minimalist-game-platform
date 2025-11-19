import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type Player = 'X' | 'O' | null;

const TicTacToe = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);

  const checkWinner = (squares: Player[]): Player | 'Draw' | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    if (squares.every((square) => square !== null)) {
      return 'Draw';
    }

    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Крестики-нолики</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            {winner ? (
              <div className="text-xl font-semibold">
                {winner === 'Draw' ? (
                  <span className="text-muted-foreground">Ничья!</span>
                ) : (
                  <span className="text-primary">Победил {winner}!</span>
                )}
              </div>
            ) : (
              <div className="text-lg text-muted-foreground">
                Ход игрока: <span className="font-bold text-primary">{isXNext ? 'X' : 'O'}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleClick(index)}
                className={`aspect-square rounded-lg border-2 border-border bg-card hover:bg-accent transition-all text-5xl font-bold flex items-center justify-center ${
                  !cell && !winner ? 'cursor-pointer hover:border-primary' : 'cursor-default'
                } ${cell === 'X' ? 'text-primary' : cell === 'O' ? 'text-accent' : ''}`}
                disabled={!!cell || !!winner}
              >
                {cell}
              </button>
            ))}
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

export default TicTacToe;
