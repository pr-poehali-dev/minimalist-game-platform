import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import TicTacToe from '@/components/games/TicTacToe';
import Connect4 from '@/components/games/Connect4';
import Battleship from '@/components/games/Battleship';

type GameType = 'tictactoe' | 'connect4' | 'battleship' | 'checkers' | 'chess';

interface Game {
  id: GameType;
  title: string;
  icon: string;
  description: string;
  players: string;
  difficulty: 'Легко' | 'Средне' | 'Сложно';
}

const games: Game[] = [
  {
    id: 'tictactoe',
    title: 'Крестики-нолики',
    icon: 'Grid3x3',
    description: 'Классическая игра 3×3',
    players: '2 игрока',
    difficulty: 'Легко'
  },
  {
    id: 'connect4',
    title: '4 в ряд',
    icon: 'Columns3',
    description: 'Соберите 4 в ряд',
    players: '2 игрока',
    difficulty: 'Средне'
  },
  {
    id: 'battleship',
    title: 'Морской бой',
    icon: 'Ship',
    description: 'Потопите флот противника',
    players: '2 игрока',
    difficulty: 'Средне'
  },
  {
    id: 'checkers',
    title: 'Шашки',
    icon: 'Circle',
    description: 'Русские шашки 8×8',
    players: '2 игрока',
    difficulty: 'Средне'
  },
  {
    id: 'chess',
    title: 'Шахматы',
    icon: 'Crown',
    description: 'Классические шахматы',
    players: '2 игрока',
    difficulty: 'Сложно'
  }
];

const leaderboard = [
  { name: 'Анна К.', rating: 2450, games: 127, wins: 89 },
  { name: 'Михаил П.', rating: 2380, games: 98, wins: 71 },
  { name: 'Елена С.', rating: 2310, games: 156, wins: 102 },
  { name: 'Дмитрий Л.', rating: 2280, games: 88, wins: 59 },
  { name: 'Ольга В.', rating: 2190, games: 142, wins: 87 }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('games');
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [userRating] = useState(1850);
  const [userGames] = useState(45);
  const [userWins] = useState(28);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Легко': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Средне': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Сложно': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Gamepad2" size={28} className="text-primary" />
              <h1 className="text-2xl font-bold">GameHub</h1>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab('games')}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeTab === 'games' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Игры
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeTab === 'leaderboard' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Рейтинг
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Профиль
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeTab === 'rules' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Правила
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeTab === 'about' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                О проекте
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {activeTab === 'games' && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Выберите игру</h2>
              <p className="text-muted-foreground text-lg">
                Играйте с друзьями по ссылке или найдите соперника онлайн
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {games.map((game) => (
                <Card
                  key={game.id}
                  className="group hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 cursor-pointer hover:scale-105 animate-scale-in"
                  onClick={() => setSelectedGame(game.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon name={game.icon} size={28} className="text-primary" />
                      </div>
                      <Badge variant="outline" className={getDifficultyColor(game.difficulty)}>
                        {game.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{game.title}</CardTitle>
                    <CardDescription className="text-base">{game.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Icon name="Users" size={16} />
                        {game.players}
                      </span>
                      <Button size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                        Играть
                        <Icon name="ArrowRight" size={16} className="ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedGame && (
              <div className="mt-12 mx-auto animate-scale-in">
                {selectedGame === 'tictactoe' && <TicTacToe />}
                {selectedGame === 'connect4' && <Connect4 />}
                {selectedGame === 'battleship' && <Battleship />}
                {(selectedGame === 'checkers' || selectedGame === 'chess') && (
                  <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                      <CardTitle className="text-center">Скоро появится</CardTitle>
                      <CardDescription className="text-center">
                        Эта игра находится в разработке
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => setSelectedGame(null)} className="w-full" size="lg">
                        <Icon name="ArrowLeft" size={20} className="mr-2" />
                        Вернуться к играм
                      </Button>
                    </CardContent>
                  </Card>
                )}
                <div className="text-center mt-6">
                  <Button onClick={() => setSelectedGame(null)} variant="ghost">
                    <Icon name="ArrowLeft" size={20} className="mr-2" />
                    Вернуться к выбору игр
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Таблица лидеров</h2>
              <p className="text-muted-foreground text-lg">Лучшие игроки платформы</p>
            </div>

            <Card>
              <CardHeader>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="all">Все</TabsTrigger>
                    <TabsTrigger value="tictactoe">Крестики</TabsTrigger>
                    <TabsTrigger value="connect4">4 в ряд</TabsTrigger>
                    <TabsTrigger value="battleship">Морской бой</TabsTrigger>
                    <TabsTrigger value="checkers">Шашки</TabsTrigger>
                    <TabsTrigger value="chess">Шахматы</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-lg">
                          #{index + 1}
                        </div>
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {player.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{player.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {player.games} игр • {player.wins} побед
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Trophy" size={20} className="text-primary" />
                        <span className="text-2xl font-bold text-primary">{player.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Мой профиль</h2>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                        И
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl">Игрок #7823</CardTitle>
                      <CardDescription className="text-base mt-1">
                        Участник с ноября 2024
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center p-6 rounded-lg bg-accent/50">
                      <Icon name="Trophy" size={32} className="mx-auto mb-2 text-primary" />
                      <p className="text-3xl font-bold">{userRating}</p>
                      <p className="text-sm text-muted-foreground mt-1">Рейтинг</p>
                    </div>
                    <div className="text-center p-6 rounded-lg bg-accent/50">
                      <Icon name="Target" size={32} className="mx-auto mb-2 text-primary" />
                      <p className="text-3xl font-bold">{userGames}</p>
                      <p className="text-sm text-muted-foreground mt-1">Игр сыграно</p>
                    </div>
                    <div className="text-center p-6 rounded-lg bg-accent/50">
                      <Icon name="Award" size={32} className="mx-auto mb-2 text-primary" />
                      <p className="text-3xl font-bold">{userWins}</p>
                      <p className="text-sm text-muted-foreground mt-1">Побед</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>История игр</CardTitle>
                  <CardDescription>Последние 5 партий</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { game: 'Крестики-нолики', result: 'Победа', rating: '+25', time: '10 минут назад' },
                      { game: '4 в ряд', result: 'Поражение', rating: '-18', time: '1 час назад' },
                      { game: 'Морской бой', result: 'Победа', rating: '+22', time: '3 часа назад' },
                      { game: 'Шашки', result: 'Победа', rating: '+28', time: 'Вчера' },
                      { game: 'Крестики-нолики', result: 'Ничья', rating: '0', time: 'Вчера' }
                    ].map((match, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              match.result === 'Победа'
                                ? 'bg-green-500'
                                : match.result === 'Поражение'
                                ? 'bg-red-500'
                                : 'bg-muted'
                            }`}
                          />
                          <div>
                            <p className="font-medium">{match.game}</p>
                            <p className="text-sm text-muted-foreground">{match.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={match.result === 'Победа' ? 'default' : 'outline'}
                            className={
                              match.result === 'Победа'
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : match.result === 'Поражение'
                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                : ''
                            }
                          >
                            {match.result}
                          </Badge>
                          <p className="text-sm font-medium mt-1">{match.rating} рейтинга</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Правила игр</h2>
            </div>

            <Tabs defaultValue="tictactoe" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger value="tictactoe">Крестики-нолики</TabsTrigger>
                <TabsTrigger value="connect4">4 в ряд</TabsTrigger>
                <TabsTrigger value="battleship">Морской бой</TabsTrigger>
                <TabsTrigger value="checkers">Шашки</TabsTrigger>
                <TabsTrigger value="chess">Шахматы</TabsTrigger>
              </TabsList>

              <TabsContent value="tictactoe">
                <Card>
                  <CardHeader>
                    <CardTitle>Крестики-нолики</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Цель игры</h3>
                      <p className="text-muted-foreground">
                        Выстроить три своих символа (крестика или нолика) в ряд по горизонтали, вертикали или
                        диагонали на поле 3×3.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Правила</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Игроки ходят по очереди, ставя свой символ в пустую клетку</li>
                        <li>Первым ходит игрок с крестиками</li>
                        <li>Победителем становится тот, кто первым выстроит три символа в ряд</li>
                        <li>Если все клетки заполнены и никто не выиграл — ничья</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="connect4">
                <Card>
                  <CardHeader>
                    <CardTitle>4 в ряд</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Цель игры</h3>
                      <p className="text-muted-foreground">
                        Выстроить четыре своих фишки подряд по горизонтали, вертикали или диагонали на поле 7×6.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Правила</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Игроки по очереди опускают свои фишки в один из семи столбцов</li>
                        <li>Фишка падает вниз до первой свободной клетки в выбранном столбце</li>
                        <li>Победителем становится тот, кто первым соберёт 4 фишки подряд</li>
                        <li>Если поле заполнено и никто не победил — ничья</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="battleship">
                <Card>
                  <CardHeader>
                    <CardTitle>Морской бой</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Цель игры</h3>
                      <p className="text-muted-foreground">
                        Потопить все корабли противника раньше, чем он потопит ваши.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Правила</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Каждый игрок расставляет флот: 1×4-палубный, 2×3-палубных, 3×2-палубных, 4×1-палубных</li>
                        <li>Корабли не могут касаться друг друга даже углами</li>
                        <li>Игроки по очереди делают выстрелы, называя координаты клетки</li>
                        <li>При попадании игрок делает ещё один ход</li>
                        <li>Побеждает тот, кто первым потопит все корабли противника</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="checkers">
                <Card>
                  <CardHeader>
                    <CardTitle>Шашки (русские)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Цель игры</h3>
                      <p className="text-muted-foreground">
                        Уничтожить все шашки противника или лишить их возможности хода.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Правила</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Простые шашки ходят только вперёд по диагонали на одну клетку</li>
                        <li>При достижении последнего ряда шашка превращается в дамку</li>
                        <li>Дамка может ходить на любое расстояние по диагонали</li>
                        <li>Взятие обязательно: если можно бить — нужно бить</li>
                        <li>При нескольких вариантах взятия игрок выбирает любой</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chess">
                <Card>
                  <CardHeader>
                    <CardTitle>Шахматы</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Цель игры</h3>
                      <p className="text-muted-foreground">Поставить мат королю противника.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Основные правила</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Белые ходят первыми, затем игроки чередуются</li>
                        <li>Каждая фигура ходит по-своему: пешка вперёд, конь буквой Г, и т.д.</li>
                        <li>Нельзя ходить так, чтобы подставить своего короля под шах</li>
                        <li>Мат — это шах, от которого нет защиты</li>
                        <li>Пат (невозможность хода без шаха) — ничья</li>
                        <li>Рокировка, взятие на проходе — специальные ходы</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">О проекте</h2>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>GameHub</CardTitle>
                  <CardDescription>Платформа для классических настольных игр</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    GameHub — это минималистичная платформа для любителей классических настольных игр. Играйте с
                    друзьями по ссылке или находите соперников онлайн, соревнуйтесь за место в таблице лидеров и
                    повышайте свой рейтинг.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-6 rounded-lg bg-accent/50">
                      <Icon name="Gamepad2" size={32} className="mx-auto mb-3 text-primary" />
                      <h3 className="font-semibold mb-2">5 игр</h3>
                      <p className="text-sm text-muted-foreground">
                        Классические игры на любой вкус
                      </p>
                    </div>
                    <div className="text-center p-6 rounded-lg bg-accent/50">
                      <Icon name="Users" size={32} className="mx-auto mb-3 text-primary" />
                      <h3 className="font-semibold mb-2">Мультиплеер</h3>
                      <p className="text-sm text-muted-foreground">
                        Играйте с друзьями или онлайн
                      </p>
                    </div>
                    <div className="text-center p-6 rounded-lg bg-accent/50">
                      <Icon name="Trophy" size={32} className="mx-auto mb-3 text-primary" />
                      <h3 className="font-semibold mb-2">Рейтинг</h3>
                      <p className="text-sm text-muted-foreground">
                        Система рейтинга и достижений
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Возможности</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex gap-4">
                      <Icon name="Link" size={24} className="text-primary flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Игра по ссылке</h3>
                        <p className="text-sm text-muted-foreground">
                          Создавайте приватные игры и приглашайте друзей по уникальной ссылке
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Icon name="Users" size={24} className="text-primary flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Поиск соперника</h3>
                        <p className="text-sm text-muted-foreground">
                          Автоматический подбор соперника с похожим уровнем игры
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Icon name="BarChart" size={24} className="text-primary flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Статистика</h3>
                        <p className="text-sm text-muted-foreground">
                          Отслеживайте свой прогресс, историю игр и достижения
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Icon name="Zap" size={24} className="text-primary flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Быстрые партии</h3>
                        <p className="text-sm text-muted-foreground">
                          Минималистичный интерфейс для комфортной игры без отвлечений
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">© 2024 GameHub. Все права защищены.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Контакты
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Поддержка
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;