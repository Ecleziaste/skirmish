'use strict';
//создание экземпляров оружия и брони
let startingArmor = new Armor ("jacket");

let makarov = new Makarov ("Makarov gun");
let remington = new Remington870("Remington-870")
let uzi = new UZI ("UZI")
let shortBarrel = new Shortbarrel ("Shortbarrel shotgun");
//создание 2 оппонентов (левого и правого - названо для удобства разработки)
let leftPlayer = new Humanoid("Bandit", uzi, startingArmor);
let rightPlayer = new Humanoid("Soldier", shortBarrel, startingArmor);

let target = document.querySelectorAll( '.bodyparts' );
let targets = Array.from( target );

// берем кнопки левого и правого оппонента и навешиваем на них листенеры для начала стрельбы
const leftShot = document.querySelector ('.opponent_1_shot');
const rightShot = document.querySelector ('.opponent_2_shot');
// запускаем рандомайзер для рандомного выстрела по противнику для левого игрока,
// если он удачный, то совершается выстрел в рандомную часть тела праавого игркоа из текущего оружия левого
leftShot.addEventListener('click', () => {
    let random = randomizerLeft();
    accRoll(leftPlayer, rightPlayer, random);
});
// запускаем рандомайзер для рандомного выстрела по противнику
rightShot.addEventListener('click', () => {
    let random = randomizerLeft();
    accRoll(rightPlayer, leftPlayer, random);
});

// // спрашиваем имя игроков, переделать потом в модальное окно или по клику на имени в диве статов
// leftPlayer.name = prompt("Введите имя левого игрока", "Bandit");
// rightPlayer.name = prompt("Введите имя правого игрока", "Soldier");

// TODO: сделать модальное окно, возникающее в самом начале, где нужно выбрать кто будет стрелять первым(левый оппонент или правый).
// в зависимости от выбора убираем опасити или как-то наоборот выделяем того, кто должен стрелять

// навешиваем цели и последствия от их поражения на левого
// здесь и далее i - часть тела объекта для защиты и атаки, j - кликабельная часть тела, отображаемая пользователю 
for ( let i = 0; i <= 5; i++ ) {
    targets[i].addEventListener('click', () => {
        aimShot (rightPlayer, leftPlayer, i);
        let j = i;
        setTimeout(checkWoundsCondition ( leftPlayer , i , j ), 0) 
    });
    
}
// навешиваем цели и последствия на правого
for ( let i = 0; i <= 5; i++ ) {
    targets[i+6].addEventListener('click', () => {
        aimShot (leftPlayer, rightPlayer, i);
        let j = i + 6;
        checkWoundsCondition ( rightPlayer , i , j);
    });
    
}
// воля богов (хилим всех и обнуляем состояния ран)
let healButton = document.querySelector( '.heal_all' );
healButton.addEventListener('click', () => {
    // leftPlayer.heavyWounds = 0;
    // rightPlayer.heavyWounds = 0;
    leftPlayer.dmgTaken = [0,0,0,0,0,0];
    rightPlayer.dmgTaken = [0,0,0,0,0,0];
    // тестим механику хила
    leftPlayer.changeHealth(0);
    rightPlayer.changeHealth(0);
    leftPlayer.changeAccuracy(0);
    rightPlayer.changeAccuracy(0);
    leftPlayer.currentHealth = leftPlayer.maxHealth;
    rightPlayer.currentHealth = rightPlayer.maxHealth;
    leftPlayer.checkCondition(0);
    rightPlayer.checkCondition(0);
    for ( let i = 0; i <= 5; i++ ) {
        let j = i;
        checkWoundsCondition ( leftPlayer , i , j );  
    }
    for ( let i = 0; i <= 5; i++ ) {
        let j = i+6;
        checkWoundsCondition ( rightPlayer , i , j );  
    }
    alert("Боги желают продолжения битвы!")
    console.log("Боги желают продолжения битвы!")
});
// кнопка рандомайзер, решающая, кто стреляет первым
document.querySelector('.randomizer').addEventListener('click', () => {
    let result = randomizerLeft() + 1;
    if (result <= 3) {
        alert("Стреляет игрок СЛЕВА")
    } else {
        alert("Стреляет игрок СПРАВА")
    }
});

// лечение черепов для тестов, ради аптечек(лечит всё тело на определенную величину) и бинтов(для одной части тела)
let healLeftHeadBtn = document.querySelector( '.opponent_1_heal_head' );
healLeftHeadBtn.addEventListener('click', () => {
    if (leftPlayer.dmgTaken[0] >= 1) {
    leftPlayer.dmgTaken[0] -= 2;
    checkWoundsCondition(leftPlayer, 0, 0);
    leftPlayer.currentHealth += 2;
    }
    if (leftPlayer.dmgTaken[0] <= 0){
        leftPlayer.dmgTaken[0] = 0;
        // чтобы не заходило в минус
        alert('skull fully cured')
    }
});
let healRightHeadBtn = document.querySelector( '.opponent_2_heal_head' );
healRightHeadBtn.addEventListener('click', () => {
    if (rightPlayer.dmgTaken[0] >= 1) {
    rightPlayer.dmgTaken[0] -= 2;
    checkWoundsCondition(rightPlayer, 0, 6);
    rightPlayer.currentHealth += 2;
    }
    if (rightPlayer.dmgTaken[0] <= 0) {
        rightPlayer.dmgTaken[0] = 0;
        alert('skull fully cured')
    }
});

// ДОБАВИТЬ СЧЕТЧИК ХОДОВ. 2 независимых счетчика(shotsMade) на кнопках Take a shot! оппонентов(на замыкании) плюсуются в общий счетчик.
// пометить уже того, кто сейчас должен стрелять. возможно добавления класса к кнопке выстрела (или мземенеие бордера на огромный бордер, ченить попроще пока что)
