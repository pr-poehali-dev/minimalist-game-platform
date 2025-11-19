import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { type GameRoom, updateRoomState, getRoom, isHost, getPlayerId } from '@/lib/gameRoom';

type Player = 'X' | 'O' | null;

interface TicTacToeProps {
  room?: GameRoom;
}

const TicTacToe = ({ room }: TicTacToeProps) => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [localRoom, setLocalRoom] = useState<GameRoom | undefined>(room);

  const isMultiplayer = !!room;
  const playerIsHost = room ? isHost(room) : false;
  const playerSymbol = playerIsHost ? 'X' : 'O';
  const isPlayerTurn = isMultiplayer
    ? (isXNext && playerIsHost) || (!isXNext && !playerIsHost)
    : true;

  useEffect(() => {
    if (!room) return;

    const interval = setInterval(() => {
      const updatedRoom = getRoom(room.id);
      if (updatedRoom && updatedRoom.gameState) {
        setLocalRoom(updatedRoom);
        setBoard(updatedRoom.gameState.board || Array(9).fill(null));
        setIsXNext(updatedRoom.currentTurn === 'host');
        setWinner(updatedRoom.gameState.winner || null);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [room]);

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
    if (isMultiplayer && !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    }

    if (room) {
      const nextTurn = playerIsHost ? 'guest' : 'host';
      updateRoomState(room.id, { board: newBoard, winner: gameWinner }, nextTurn);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);

    if (room) {
      updateRoomState(room.id, { board: Array(9).fill(null), winner: null }, 'host');
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Крестики-нолики</CardTitle>
          {isMultiplayer && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              {playerIsHost ? 'Хозяин' : 'Гость'} ({playerSymbol})
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
                      ? winner === playerSymbol
                        ? 'Вы победили!'
                        : 'Противник победил!'
                      : `Победил ${winner}!`}
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
                    Ход игрока: <span className="font-bold text-primary">{isXNext ? 'X' : 'O'}</span>
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

          <div className="grid grid-cols-3 gap-3">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleClick(index)}
                className={`aspect-square rounded-lg border-2 border-border bg-card hover:bg-accent transition-all text-5xl font-bold flex items-center justify-center ${
                  !cell && !winner && isPlayerTurn ? 'cursor-pointer hover:border-primary' : 'cursor-default'
                } ${cell === 'X' ? 'text-primary' : cell === 'O' ? 'text-accent' : ''}`}
                disabled={!!cell || !!winner || (isMultiplayer && !isPlayerTurn)}
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
