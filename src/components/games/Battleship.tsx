import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { type GameRoom, updateRoomState, getRoom, isHost } from '@/lib/gameRoom';

type CellState = 'empty' | 'ship' | 'hit' | 'miss';
type GamePhase = 'setup' | 'playing' | 'finished';

const BOARD_SIZE = 10;

interface BattleshipProps {
  room?: GameRoom;
}

const Battleship = ({ room }: BattleshipProps) => {
  const isMultiplayer = !!room;
  const playerIsHost = room ? isHost(room) : false;
  
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [playerBoard, setPlayerBoard] = useState<CellState[][]>(
    Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill('empty'))
  );
  const [enemyBoard, setEnemyBoard] = useState<CellState[][]>(
    Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill('empty'))
  );
  const [playerHits, setPlayerHits] = useState(0);
  const [enemyHits, setEnemyHits] = useState(0);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'enemy'>('player');
  const [winner, setWinner] = useState<'player' | 'enemy' | null>(null);

  const TOTAL_SHIPS = 10;

  useEffect(() => {
    if (!room) return;

    const interval = setInterval(() => {
      const updatedRoom = getRoom(room.id);
      if (updatedRoom && updatedRoom.gameState) {
        const state = updatedRoom.gameState;
        if (playerIsHost) {
          setPlayerBoard(state.hostBoard || playerBoard);
          setEnemyBoard(state.guestBoard || enemyBoard);
        } else {
          setPlayerBoard(state.guestBoard || playerBoard);
          setEnemyBoard(state.hostBoard || enemyBoard);
        }
        setCurrentTurn(updatedRoom.currentTurn === 'host' ? 'player' : 'enemy');
        setPlayerHits(state.playerHits || 0);
        setEnemyHits(state.enemyHits || 0);
        setWinner(state.winner || null);
        setPhase(state.phase || phase);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [room, playerIsHost]);

  const placeRandomShips = (): CellState[][] => {
    const board: CellState[][] = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill('empty'));

    const ships = [
      { size: 4, count: 1 },
      { size: 3, count: 2 },
      { size: 2, count: 3 },
      { size: 1, count: 4 }
    ];

    const canPlaceShip = (row: number, col: number, size: number, isHorizontal: boolean): boolean => {
      if (isHorizontal) {
        if (col + size > BOARD_SIZE) return false;
        for (let c = col; c < col + size; c++) {
          if (board[row][c] === 'ship') return false;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = row + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === 'ship') {
                return false;
              }
            }
          }
        }
      } else {
        if (row + size > BOARD_SIZE) return false;
        for (let r = row; r < row + size; r++) {
          if (board[r][col] === 'ship') return false;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = col + dc;
              if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === 'ship') {
                return false;
              }
            }
          }
        }
      }
      return true;
    };

    ships.forEach((ship) => {
      for (let i = 0; i < ship.count; i++) {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 100) {
          const row = Math.floor(Math.random() * BOARD_SIZE);
          const col = Math.floor(Math.random() * BOARD_SIZE);
          const isHorizontal = Math.random() < 0.5;

          if (canPlaceShip(row, col, ship.size, isHorizontal)) {
            if (isHorizontal) {
              for (let c = col; c < col + ship.size; c++) {
                board[row][c] = 'ship';
              }
            } else {
              for (let r = row; r < row + ship.size; r++) {
                board[r][col] = 'ship';
              }
            }
            placed = true;
          }
          attempts++;
        }
      }
    });

    return board;
  };

  const startGame = () => {
    const newPlayerBoard = placeRandomShips();
    const newEnemyBoard = placeRandomShips();
    setPlayerBoard(newPlayerBoard);
    setEnemyBoard(newEnemyBoard);
    setPhase('playing');
    setPlayerHits(0);
    setEnemyHits(0);
    setCurrentTurn('player');
    setWinner(null);

    if (room) {
      updateRoomState(room.id, {
        hostBoard: playerIsHost ? newPlayerBoard : newEnemyBoard,
        guestBoard: playerIsHost ? newEnemyBoard : newPlayerBoard,
        playerHits: 0,
        enemyHits: 0,
        phase: 'playing'
      }, 'host');
    }
  };

  const handlePlayerShot = (row: number, col: number) => {
    if (phase !== 'playing' || currentTurn !== 'player' || winner) return;
    if (enemyBoard[row][col] === 'hit' || enemyBoard[row][col] === 'miss') return;

    const newBoard = enemyBoard.map((r) => [...r]);
    const isHit = newBoard[row][col] === 'ship';

    newBoard[row][col] = isHit ? 'hit' : 'miss';
    setEnemyBoard(newBoard);

    if (isHit) {
      const newHits = playerHits + 1;
      setPlayerHits(newHits);
      if (newHits >= TOTAL_SHIPS) {
        setWinner('player');
        setPhase('finished');
        if (room) {
          updateRoomState(room.id, {
            hostBoard: playerIsHost ? playerBoard : newBoard,
            guestBoard: playerIsHost ? newBoard : playerBoard,
            playerHits: newHits,
            enemyHits,
            winner: 'player',
            phase: 'finished'
          }, 'guest');
        }
        return;
      }
    }

    if (room) {
      const nextTurn = playerIsHost ? 'guest' : 'host';
      updateRoomState(room.id, {
        hostBoard: playerIsHost ? playerBoard : newBoard,
        guestBoard: playerIsHost ? newBoard : playerBoard,
        playerHits: playerHits + (isHit ? 1 : 0),
        enemyHits,
        phase: 'playing'
      }, nextTurn);
    }

    setCurrentTurn('enemy');
    if (!isMultiplayer) {
      setTimeout(enemyTurn, 1000);
    }
  };

  const enemyTurn = () => {
    const emptyCells: [number, number][] = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (playerBoard[r][c] !== 'hit' && playerBoard[r][c] !== 'miss') {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) return;

    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = playerBoard.map((r) => [...r]);
    const isHit = newBoard[row][col] === 'ship';

    newBoard[row][col] = isHit ? 'hit' : 'miss';
    setPlayerBoard(newBoard);

    if (isHit) {
      const newHits = enemyHits + 1;
      setEnemyHits(newHits);
      if (newHits >= TOTAL_SHIPS) {
        setWinner('enemy');
        setPhase('finished');
        return;
      }
    }

    setCurrentTurn('player');
  };

  const renderCell = (state: CellState, isPlayerBoard: boolean, row: number, col: number) => {
    const baseClasses = 'aspect-square rounded border-2 transition-all flex items-center justify-center';

    if (!isPlayerBoard && phase === 'playing' && state === 'empty') {
      return (
        <button
          key={`${row}-${col}`}
          onClick={() => handlePlayerShot(row, col)}
          className={`${baseClasses} border-border bg-card hover:bg-accent hover:border-primary cursor-pointer`}
          disabled={currentTurn !== 'player' || !!winner}
        >
          {currentTurn === 'player' && !winner && <Icon name="Crosshair" size={16} className="text-muted-foreground opacity-0 hover:opacity-100" />}
        </button>
      );
    }

    if (state === 'ship' && !isPlayerBoard) {
      return <div key={`${row}-${col}`} className={`${baseClasses} border-border bg-card`} />;
    }

    return (
      <div
        key={`${row}-${col}`}
        className={`${baseClasses} ${
          state === 'hit'
            ? 'border-red-500 bg-red-500/20'
            : state === 'miss'
            ? 'border-muted bg-muted/20'
            : state === 'ship'
            ? 'border-primary bg-primary/20'
            : 'border-border bg-card'
        }`}
      >
        {state === 'hit' && <Icon name="X" size={16} className="text-red-500" />}
        {state === 'miss' && <div className="w-2 h-2 rounded-full bg-muted" />}
      </div>
    );
  };

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Морской бой</CardTitle>
          {isMultiplayer && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              {playerIsHost ? 'Хозяин' : 'Гость'}
            </Badge>
          )}
        </div>
        <CardDescription className="text-center">
          {phase === 'setup' && 'Нажмите "Начать игру" чтобы расставить корабли'}
          {phase === 'playing' && !winner && `Ход: ${currentTurn === 'player' ? 'Ваш' : 'Противник'}`}
          {winner && (winner === 'player' ? 'Вы победили!' : 'Противник победил!')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {phase === 'setup' && (
            <div className="text-center">
              <Button onClick={startGame} size="lg" className="px-12">
                <Icon name="Play" size={20} className="mr-2" />
                Начать игру
              </Button>
            </div>
          )}

          {phase !== 'setup' && (
            <>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Ваше поле</h3>
                    <Badge variant="outline">
                      Попаданий противника: {enemyHits}/{TOTAL_SHIPS}
                    </Badge>
                  </div>
                  <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}>
                    {playerBoard.map((row, rowIndex) =>
                      row.map((cell, colIndex) => renderCell(cell, true, rowIndex, colIndex))
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Поле противника</h3>
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                      Ваших попаданий: {playerHits}/{TOTAL_SHIPS}
                    </Badge>
                  </div>
                  <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}>
                    {enemyBoard.map((row, rowIndex) =>
                      row.map((cell, colIndex) => renderCell(cell, false, rowIndex, colIndex))
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={startGame} className="flex-1" size="lg">
                  <Icon name="RotateCcw" size={20} className="mr-2" />
                  Новая игра
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Battleship;