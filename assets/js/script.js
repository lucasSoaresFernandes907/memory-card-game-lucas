const cards = document.querySelectorAll(".card");

// ADICIONADO: Recupera jogadas e cor da sessão atual
const elementoContador = document.getElementById("contador-jogadas");
let jogadas = Number(sessionStorage.getItem("jogadasSessao")) || 0;
const coresDeFundo = ["#6563FF", "#2ecc71", "#e67e22", "#e74c3c", "#9b59b6", "#1abc9c"];
let indiceCor = Number(sessionStorage.getItem("indiceCorFundo")) || 0;

document.body.style.backgroundColor = coresDeFundo[indiceCor];
if (elementoContador) elementoContador.textContent = jogadas;

let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;

// ADICIONADO: Funções para contar jogada e trocar a cor ao zerar
function registrarJogada() {
    jogadas++;
    sessionStorage.setItem("jogadasSessao", jogadas);
    if (elementoContador) elementoContador.textContent = jogadas;
}

function mudarCorFundo() {
    indiceCor = (indiceCor + 1) % coresDeFundo.length;
    document.body.style.backgroundColor = coresDeFundo[indiceCor];
    sessionStorage.setItem("indiceCorFundo", indiceCor);
}

function flipCard({target: clickedCard}) {
    if(cardOne !== clickedCard && !disableDeck) {
        clickedCard.classList.add("flip");
        if(!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        registrarJogada(); // ADICIONADO: Conta +1 jogada ao virar o par
        let cardOneImg = cardOne.querySelector(".back-view img").src,
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if(img1 === img2) {
        matched++;
        if(matched == 8) {
            mudarCorFundo(); // ADICIONADO: Troca a cor de fundo ao zerar
            setTimeout(() => {
                return shuffleCard();
            }, 1000);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}

function shuffleCard() {
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);
    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        imgTag.src = `assets/img/img-${arr[i]}.png`;
        card.addEventListener("click", flipCard);
    });
}

shuffleCard();
    
cards.forEach(card => {
    card.addEventListener("click", flipCard);
});