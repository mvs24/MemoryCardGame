const cardContainerElement = document.querySelector(
  ".card__container"
)! as HTMLDivElement;
const timerElement = document.querySelector(".timer");

interface CardState {
  index: number;
  value: number;
  html: HTMLDivElement;
}

interface State {
  currentOpenedCards: CardState[];
  removedCards: CardState[];
  timer: number;
  gameOver: boolean;
  win: boolean;
}

const state: State = {
  currentOpenedCards: [],
  removedCards: [],
  timer: 0,
  gameOver: false,
  win: false,
};

const allCardsArr = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [1, 6, 8, 5],
  [4, 2, 7, 3],
];

allCardsArr.forEach((cardRow, index) => {
  cardRow.forEach((el) => {
    const card = `
        <div class='card hidden' id='${el}' index='${index}'>${el}</div>
    `;
    cardContainerElement.insertAdjacentHTML("beforeend", card);
  });
});

setInterval(() => {
  if (state.timer >= 30 && state.gameOver === false) {
    state.gameOver = true;
    alert("game over");
    return;
  }

  if (state.win === false && state.gameOver === false) {
    state.timer++;
    timerElement!.textContent = state.timer.toString();
  }
}, 1000);

const cardHandler = (e: any) => {
  if (state.gameOver || state.win) {
    return;
  }

  if (e.target.classList.contains("card")) {
    if (state.currentOpenedCards!.length > 1) return;
    const currentCard = e.target;
    const id = currentCard.id;
    const index = currentCard.getAttribute("index");

    if (state.removedCards.some((el) => el.value === id && el.index === index))
      return;

    currentCard.classList.remove("hidden");
    state.currentOpenedCards!.push({
      index,
      value: id,
      html: currentCard,
    });

    if (state.currentOpenedCards.length === 2) {
      if (
        state.currentOpenedCards[0].value === state.currentOpenedCards[1].value
      ) {
        state.removedCards.push(state.currentOpenedCards[0]);
        state.removedCards.push(state.currentOpenedCards[1]);
        state.removedCards.forEach((card) => {
          card.html.classList.remove("hidden");
        });
        if (state.removedCards.length === 16 && state.timer < 30) {
          state.win = true;
          setTimeout(() => {
            alert("Win");
          }, 0);
          return;
        }
        state.currentOpenedCards = [];
        return;
      }
    }

    setTimeout(() => {
      if (!state.removedCards.some((card) => id === card.value)) {
        currentCard.classList.add("hidden");
      }

      state.currentOpenedCards = state.currentOpenedCards.filter(
        (el) => el.index !== index && el.value !== id
      );
    }, 800);
  }
};

cardContainerElement.addEventListener("click", cardHandler);
