import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type GameMode = 'menu' | 'flood' | 'fire';

interface Scenario {
  id: number;
  question: string;
  options: {
    text: string;
    correct: boolean;
    explanation: string;
  }[];
}

const floodScenarios: Scenario[] = [
  {
    id: 1,
    question: 'Объявили предупреждение о наводнении. Что нужно сделать в первую очередь?',
    options: [
      { text: 'Собрать документы и ценные вещи', correct: true, explanation: 'Правильно! Документы и важные вещи нужно собрать заранее.' },
      { text: 'Включить все электроприборы', correct: false, explanation: 'Нет! Наоборот, нужно отключить электричество перед эвакуацией.' },
      { text: 'Спрятаться в подвале', correct: false, explanation: 'Нет! Подвал первым затапливается водой.' },
    ],
  },
  {
    id: 2,
    question: 'Вода начала прибывать. Куда нужно подняться?',
    options: [
      { text: 'На верхние этажи или крышу', correct: true, explanation: 'Верно! Высота - главная защита от воды.' },
      { text: 'В подвал', correct: false, explanation: 'Опасно! Подвал затопит первым.' },
      { text: 'Остаться на первом этаже', correct: false, explanation: 'Небезопасно! Нужно подняться повыше.' },
    ],
  },
  {
    id: 3,
    question: 'Ты видишь спасателей на лодке. Что делать?',
    options: [
      { text: 'Подать сигнал яркой тканью или фонариком', correct: true, explanation: 'Правильно! Так спасатели тебя быстрее увидят.' },
      { text: 'Прыгнуть в воду и плыть к ним', correct: false, explanation: 'Опасно! Течение может быть сильным, жди помощи.' },
      { text: 'Спрятаться внутри дома', correct: false, explanation: 'Нет! Нужно дать знать, что ты здесь.' },
    ],
  },
];

const fireScenarios: Scenario[] = [
  {
    id: 1,
    question: 'Ты увидел дым в лесу. Что делать?',
    options: [
      { text: 'Позвонить 112 и сообщить взрослым', correct: true, explanation: 'Правильно! Пожарные приедут быстрее, если узнают сразу.' },
      { text: 'Попробовать потушить самому', correct: false, explanation: 'Опасно! Пожар тушат только взрослые специалисты.' },
      { text: 'Подойти поближе посмотреть', correct: false, explanation: 'Очень опасно! От огня нужно держаться подальше.' },
    ],
  },
  {
    id: 2,
    question: 'Пожар приближается к дому. Как правильно эвакуироваться?',
    options: [
      { text: 'Уйти перпендикулярно направлению огня', correct: true, explanation: 'Верно! Так ты быстрее окажешься в безопасности.' },
      { text: 'Бежать навстречу огню', correct: false, explanation: 'Очень опасно! Никогда не иди к огню.' },
      { text: 'Спрятаться в доме', correct: false, explanation: 'Опасно! Дом может загореться, нужно эвакуироваться.' },
    ],
  },
  {
    id: 3,
    question: 'В доме задымление. Как нужно двигаться?',
    options: [
      { text: 'Пригнувшись или ползком, прикрыв нос тканью', correct: true, explanation: 'Правильно! Внизу меньше дыма, а ткань защитит дыхание.' },
      { text: 'Встать во весь рост', correct: false, explanation: 'Опасно! Наверху больше ядовитого дыма.' },
      { text: 'Бежать очень быстро', correct: false, explanation: 'Нет! Нужно двигаться осторожно, пригнувшись.' },
    ],
  },
];

export default function Index() {
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [completedScenarios, setCompletedScenarios] = useState(0);
  const { toast } = useToast();

  const scenarios = gameMode === 'flood' ? floodScenarios : fireScenarios;
  const maxScenarios = scenarios.length;

  const handleAnswer = (optionIndex: number) => {
    if (showExplanation) return;

    const option = scenarios[currentScenario].options[optionIndex];
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);

    if (option.correct) {
      setScore(score + 10);
      toast({
        title: '🎉 Правильно!',
        description: option.explanation,
        duration: 3000,
      });
    } else {
      toast({
        title: '❌ Неправильно',
        description: option.explanation,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setCompletedScenarios(completedScenarios + 1);
      setShowExplanation(false);
      setSelectedAnswer(null);
    } else {
      setGameMode('menu');
      setCurrentScenario(0);
      setCompletedScenarios(0);
      setShowExplanation(false);
      setSelectedAnswer(null);
      
      toast({
        title: '🏆 Игра завершена!',
        description: `Твой результат: ${score + (scenarios[currentScenario].options[selectedAnswer!]?.correct ? 10 : 0)} баллов из ${scenarios.length * 10}`,
        duration: 5000,
      });
    }
  };

  const resetGame = () => {
    setGameMode('menu');
    setCurrentScenario(0);
    setScore(0);
    setShowExplanation(false);
    setSelectedAnswer(null);
    setCompletedScenarios(0);
  };

  if (gameMode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4 animate-scale-in">
              Школа Безопасности 🎓
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              Учись правилам поведения в чрезвычайных ситуациях!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card 
              className="p-8 cursor-pointer hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-blue-300 shadow-xl hover:shadow-2xl animate-fade-in"
              onClick={() => setGameMode('flood')}
            >
              <div className="text-center space-y-6">
                <div className="text-8xl animate-bounce-gentle">🌊</div>
                <h2 className="text-3xl font-bold text-blue-800">Наводнение</h2>
                <p className="text-lg text-blue-700 font-medium">
                  Узнай, как вести себя во время наводнения и спастись от большой воды
                </p>
                <Button size="lg" className="w-full text-xl py-6 bg-secondary hover:bg-secondary/90 font-bold">
                  Начать игру
                  <Icon name="Play" className="ml-2" size={24} />
                </Button>
              </div>
            </Card>

            <Card 
              className="p-8 cursor-pointer hover:scale-105 transition-all duration-300 bg-gradient-to-br from-orange-100 to-red-200 border-4 border-orange-300 shadow-xl hover:shadow-2xl animate-fade-in"
              style={{ animationDelay: '0.1s' }}
              onClick={() => setGameMode('fire')}
            >
              <div className="text-center space-y-6">
                <div className="text-8xl animate-bounce-gentle" style={{ animationDelay: '0.3s' }}>🔥</div>
                <h2 className="text-3xl font-bold text-orange-800">Пожар</h2>
                <p className="text-lg text-orange-700 font-medium">
                  Научись действовать при пожаре и помогать другим в безопасности
                </p>
                <Button size="lg" className="w-full text-xl py-6 bg-accent hover:bg-accent/90 font-bold">
                  Начать игру
                  <Icon name="Play" className="ml-2" size={24} />
                </Button>
              </div>
            </Card>
          </div>

          <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Card className="p-6 max-w-2xl mx-auto bg-gradient-to-r from-purple-100 to-pink-100 border-4 border-purple-300">
              <h3 className="text-2xl font-bold text-purple-800 mb-4">
                ✨ Как играть?
              </h3>
              <div className="space-y-3 text-left text-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <p className="text-purple-700 font-medium">Выбери ситуацию: наводнение или пожар</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <p className="text-purple-700 font-medium">Читай вопрос и выбирай правильный ответ</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <p className="text-purple-700 font-medium">За каждый правильный ответ получай 10 баллов!</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = scenarios[currentScenario];
  const isFlood = gameMode === 'flood';

  return (
    <div className={`min-h-screen p-4 md:p-8 ${
      isFlood 
        ? 'bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100' 
        : 'bg-gradient-to-br from-orange-50 via-red-50 to-yellow-100'
    }`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <Button 
            variant="outline" 
            size="lg"
            onClick={resetGame}
            className="font-bold text-lg border-2"
          >
            <Icon name="Home" className="mr-2" size={24} />
            В меню
          </Button>
          
          <div className="flex items-center gap-4">
            <div className={`text-2xl font-bold px-6 py-3 rounded-2xl border-4 ${
              isFlood 
                ? 'bg-blue-200 border-blue-400 text-blue-800' 
                : 'bg-orange-200 border-orange-400 text-orange-800'
            }`}>
              <Icon name="Star" className="inline mr-2" size={24} />
              {score} баллов
            </div>
          </div>
        </div>

        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-foreground">
              Вопрос {currentScenario + 1} из {maxScenarios}
            </span>
            <span className="text-lg font-semibold text-muted-foreground">
              {Math.round((completedScenarios / maxScenarios) * 100)}% пройдено
            </span>
          </div>
          <Progress value={(completedScenarios / maxScenarios) * 100} className="h-4" />
        </div>

        <Card className={`p-8 mb-8 border-4 shadow-2xl animate-scale-in ${
          isFlood 
            ? 'bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-300' 
            : 'bg-gradient-to-br from-orange-50 to-red-100 border-orange-300'
        }`}>
          <div className="flex items-start gap-6 mb-8">
            <div className="text-7xl animate-float">
              {isFlood ? '🌊' : '🔥'}
            </div>
            <h2 className="text-3xl font-bold text-foreground leading-tight">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = option.correct;
              const showResult = showExplanation && isSelected;

              return (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showExplanation}
                  size="lg"
                  className={`w-full text-left text-lg py-8 px-6 h-auto justify-start font-bold border-4 transition-all duration-300 ${
                    showResult
                      ? isCorrect
                        ? 'bg-green-500 hover:bg-green-500 text-white border-green-600 animate-celebrate'
                        : 'bg-red-500 hover:bg-red-500 text-white border-red-600 animate-wiggle'
                      : isFlood
                      ? 'bg-blue-100 hover:bg-blue-200 text-blue-900 border-blue-300 hover:scale-105'
                      : 'bg-orange-100 hover:bg-orange-200 text-orange-900 border-orange-300 hover:scale-105'
                  }`}
                  variant={showResult ? 'default' : 'outline'}
                >
                  <span className="text-3xl mr-4">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option.text}</span>
                  {showResult && (
                    <span className="text-3xl ml-4">
                      {isCorrect ? '✅' : '❌'}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="mt-8 animate-scale-in">
              <Card className={`p-6 border-4 ${
                scenarios[currentScenario].options[selectedAnswer!]?.correct
                  ? 'bg-green-50 border-green-400'
                  : 'bg-red-50 border-red-400'
              }`}>
                <p className="text-xl font-bold mb-3">
                  {scenarios[currentScenario].options[selectedAnswer!]?.correct
                    ? '🎉 Молодец!'
                    : '💡 Запомни:'}
                </p>
                <p className="text-lg text-foreground font-medium">
                  {scenarios[currentScenario].options[selectedAnswer!]?.explanation}
                </p>
              </Card>

              <Button
                onClick={nextScenario}
                size="lg"
                className="w-full mt-6 text-xl py-8 font-bold bg-primary hover:bg-primary/90"
              >
                {currentScenario < scenarios.length - 1 ? (
                  <>
                    Следующий вопрос
                    <Icon name="ArrowRight" className="ml-2" size={24} />
                  </>
                ) : (
                  <>
                    Завершить игру
                    <Icon name="Trophy" className="ml-2" size={24} />
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>

        <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Card className={`p-6 inline-block border-4 ${
            isFlood 
              ? 'bg-blue-50 border-blue-300' 
              : 'bg-orange-50 border-orange-300'
          }`}>
            <p className="text-lg font-bold text-muted-foreground">
              💡 Подсказка: читай внимательно и думай о безопасности!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
