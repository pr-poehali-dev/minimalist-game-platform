export interface GameRoom {
  id: string;
  gameType: 'tictactoe' | 'connect4' | 'battleship';
  hostId: string;
  guestId: string | null;
  gameState: any;
  currentTurn: 'host' | 'guest';
  status: 'waiting' | 'playing' | 'finished';
  createdAt: number;
}

const ROOMS_KEY = 'gamehub_rooms';
const PLAYER_ID_KEY = 'gamehub_player_id';

export const generateRoomId = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const generatePlayerId = (): string => {
  let playerId = localStorage.getItem(PLAYER_ID_KEY);
  if (!playerId) {
    playerId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem(PLAYER_ID_KEY, playerId);
  }
  return playerId;
};

export const getPlayerId = (): string => {
  return generatePlayerId();
};

export const createRoom = (gameType: GameRoom['gameType']): GameRoom => {
  const room: GameRoom = {
    id: generateRoomId(),
    gameType,
    hostId: getPlayerId(),
    guestId: null,
    gameState: null,
    currentTurn: 'host',
    status: 'waiting',
    createdAt: Date.now()
  };

  saveRoom(room);
  return room;
};

export const joinRoom = (roomId: string): GameRoom | null => {
  const room = getRoom(roomId);
  if (!room || room.status !== 'waiting') {
    return null;
  }

  room.guestId = getPlayerId();
  room.status = 'playing';
  saveRoom(room);
  return room;
};

export const getRoom = (roomId: string): GameRoom | null => {
  const rooms = getAllRooms();
  return rooms.find((r) => r.id === roomId) || null;
};

export const getAllRooms = (): GameRoom[] => {
  const stored = localStorage.getItem(ROOMS_KEY);
  if (!stored) return [];
  
  const rooms: GameRoom[] = JSON.parse(stored);
  const now = Date.now();
  const validRooms = rooms.filter((r) => now - r.createdAt < 24 * 60 * 60 * 1000);
  
  if (validRooms.length !== rooms.length) {
    localStorage.setItem(ROOMS_KEY, JSON.stringify(validRooms));
  }
  
  return validRooms;
};

export const saveRoom = (room: GameRoom): void => {
  const rooms = getAllRooms();
  const index = rooms.findIndex((r) => r.id === room.id);
  
  if (index >= 0) {
    rooms[index] = room;
  } else {
    rooms.push(room);
  }
  
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
};

export const updateRoomState = (roomId: string, gameState: any, nextTurn: 'host' | 'guest'): void => {
  const room = getRoom(roomId);
  if (!room) return;
  
  room.gameState = gameState;
  room.currentTurn = nextTurn;
  saveRoom(room);
};

export const finishRoom = (roomId: string): void => {
  const room = getRoom(roomId);
  if (!room) return;
  
  room.status = 'finished';
  saveRoom(room);
};

export const deleteRoom = (roomId: string): void => {
  const rooms = getAllRooms();
  const filtered = rooms.filter((r) => r.id !== roomId);
  localStorage.setItem(ROOMS_KEY, JSON.stringify(filtered));
};

export const getRoomLink = (roomId: string): string => {
  return `${window.location.origin}/?room=${roomId}`;
};

export const isHost = (room: GameRoom): boolean => {
  return getPlayerId() === room.hostId;
};

export const isGuest = (room: GameRoom): boolean => {
  return getPlayerId() === room.guestId;
};
