let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let filteredQuestions = [];

async function loadQuestions() {
  const response = await fetch('data/questions.json');
  questions = await response.json();
  displayTopics();
}

function displayTopics() {
  const topics = [...new Set(questions.map(q => q.topic))];
  const topicButtons = document.getElementById('topic-buttons');
  topicButtons.innerHTML = '';
  
  topics.forEach(topic => {
    const btn = document.createElement('button');
    btn.textContent = topic;
    btn.onclick = () => startQuiz(topic);
    topicButtons.appendChild(btn);
  });
}

function startQuiz(topic) {
  filteredQuestions = questions.filter(q => q.topic === topic);
  currentQuestionIndex = 0;
  score = 0;
  
  document.getElementById('topic-selection').style.display = 'none';
  document.getElementById('quiz-area').style.display = 'block';
  document.getElementById('score-area').style.display = 'none';
  
  displayQuestion();
}

function displayQuestion() {
  const question = filteredQuestions[currentQuestionIndex];
  document.getElementById('question-text').textContent = question.question;
  
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = option;
    btn.onclick = () => selectAnswer(index);
    optionsContainer.appendChild(btn);
  });
  
  document.getElementById('feedback').style.display = 'none';
  document.getElementById('next-btn').style.display = 'none';
}

function selectAnswer(selectedIndex) {
  const question = filteredQuestions[currentQuestionIndex];
  const buttons = document.querySelectorAll('.option-btn');
  
  buttons.forEach((btn, index) => {
    btn.disabled = true;
    if (index === question.answerIndex) {
      btn.classList.add('correct');
    } else if (index === selectedIndex) {
      btn.classList.add('incorrect');
    }
  });
  
  const isCorrect = selectedIndex === question.answerIndex;
  if (isCorrect) score++;
  
  document.getElementById('feedback').style.display = 'block';
  document.getElementById('feedback-text').textContent = isCorrect ? 'Correct!' : 'Incorrect!';
  document.getElementById('explanation-text').textContent = question.explanation;
  
  if (currentQuestionIndex < filteredQuestions.length - 1) {
    document.getElementById('next-btn').style.display = 'block';
  } else {
    setTimeout(showScore, 1500);
  }
}

function nextQuestion() {
  currentQuestionIndex++;
  displayQuestion();
}

function showScore() {
  document.getElementById('quiz-area').style.display = 'none';
  document.getElementById('score-area').style.display = 'block';
  document.getElementById('score-text').textContent = `You scored ${score} out of ${filteredQuestions.length}`;
}

function backToTopics() {
  document.getElementById('quiz-area').style.display = 'none';
  document.getElementById('topic-selection').style.display = 'block';
}

function restart() {
  document.getElementById('score-area').style.display = 'none';
  document.getElementById('topic-selection').style.display = 'block';
}

document.getElementById('next-btn').onclick = nextQuestion;
document.getElementById('back-to-topics').onclick = backToTopics;
document.getElementById('restart-btn').onclick = restart;

loadQuestions();