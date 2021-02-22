'use strict';
//создание экземпляров оружия и брони
let startingArmor = new Armor ("jacket");
// (name, type, oneHanded, damage, accuracy, capacity, jammingChance, size, availability)
let makarov = new Weapon ( "Makarov gun", "pistol", true, 2, -1, 3, 0, 1, 1 );
let uzi = new Weapon ( "UZI", "smg", true, 2, -1, 3, 0, 1, 1 );
// shortbarrel -3 accuracy against humanoids; -2 accuracy against monsters
let shortBarrel = new Weapon ( "Shortbarrel", "shotgun", false, 3, -3, 4, 0, 1, 1 );
let remington = new Weapon( "Remington-870", "shotgun", false, 3, -2, 4, 0, 1, 1 );

//создание 2 оппонентов (левого и правого - названо для удобства разработки)
let leftPlayer = new Humanoid( "Bandit", uzi, startingArmor );
let rightPlayer = new Humanoid( "Soldier", shortBarrel, startingArmor );

let target = document.querySelectorAll( '.bodyparts' );
let targets = Array.from( target );

// берем кнопки левого и правого оппонента и навешиваем на них листенеры для начала стрельбы
const leftShot = document.querySelector ('.opponent_1_shot');
const rightShot = document.querySelector ('.opponent_2_shot');
// запускаем рандомайзер для рандомного выстрела по противнику для левого игрока,
// если он удачный, то совершается выстрел в рандомную часть тела праавого игркоа из текущего оружия левого
leftShot.addEventListener('click', () => {
    let random = randomizerZeroFive();
    accRoll(leftPlayer, rightPlayer, random);
    shotsMadeLeft = leftShotCounter();
    shotsMadeTotal = shotsMadeLeft + shotsMadeRight;
    showStats();
});
// запускаем рандомайзер для рандомного выстрела по противнику
rightShot.addEventListener('click', () => {
    let random = randomizerZeroFive();
    accRoll(rightPlayer, leftPlayer, random);
    shotsMadeRight = rightShotCounter();
    shotsMadeTotal = shotsMadeLeft + shotsMadeRight;
    showStats(); 
});
// СЧЕТЧИК ХОДОВ. 2 независимых счетчика(shotsMade) на кнопках Take a shot! оппонентов(на замыкании) плюсуются в общий счетчик.
// пометить уже того, кто сейчас должен стрелять. возможно добавление класса к кнопке выстрела (или мземенеие бордера на огромный бордер, ченить попроще пока что)
function createCounter() {
    let counter = 0;
    return function() {
      return counter++;
    }
  };
  const leftShotCounter = createCounter();
  const rightShotCounter = createCounter();
  let shotsMadeLeft = leftShotCounter();
  let shotsMadeRight = rightShotCounter();
  let shotsMadeTotal = 0;

// TODO: сделать модальное окно, возникающее в самом начале, где нужно выбрать кто будет стрелять первым(левый оппонент или правый).
// в зависимости от выбора убираем опасити или как-то наоборот выделяем того, кто должен стрелять

// навешиваем цели и последствия от их поражения на левого
// здесь и далее i - часть тела объекта для защиты и атаки, j - кликабельная часть тела, отображаемая пользователю 
for ( let i = 0; i <= 5; i++ ) {
    targets[i].addEventListener('click', () => {
        aimShot (rightPlayer, leftPlayer, i);
        let j = i;
        checkWoundsCondition ( leftPlayer , i , j );
        showStats();
    });
    
}
// навешиваем цели и последствия на правого
for ( let i = 0; i <= 5; i++ ) {
    targets[i+6].addEventListener('click', () => {
        aimShot (leftPlayer, rightPlayer, i);
        let j = i + 6;
        checkWoundsCondition ( rightPlayer , i , j);
        showStats();
    });
    
}
// воля богов (хилим всех и обнуляем состояния ран)
let healButton = document.querySelector( '.heal_all' );
healButton.addEventListener('click', () => {
    // leftPlayer.heavyWounds = 0;
    // rightPlayer.heavyWounds = 0;
    leftPlayer.dmgTaken = [0,0,0,0,0,0];
    rightPlayer.dmgTaken = [0,0,0,0,0,0];
    leftPlayer.hvyWndCheck();
    rightPlayer.hvyWndCheck();
    // тестим механику хила
    leftPlayer.changeHealth(0);
    rightPlayer.changeHealth(0);
    leftPlayer.changeAccuracy(0);
    rightPlayer.changeAccuracy(0);
    leftPlayer.changeMobility(0);
    rightPlayer.changeMobility(0);
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
    showStats();
    alert("Боги желают продолжения битвы!")
    console.log("Боги желают продолжения битвы!")
});
// кнопка рандомайзер, решающая, кто стреляет первым
document.querySelector('.randomizer').addEventListener('click', () => {
    let result = randomizerZeroFive() + 1;
    if (result <= 3) {
        alert("Стреляет игрок СЛЕВА <=")
    } else {
        alert("Стреляет игрок СПРАВА =>")
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
// даем возможность сменить имя игрока, кликнув на поле с именем
let name_1 = document.querySelector('.opp_1_stats__name');
let name_2 = document.querySelector('.opp_2_stats__name');
name_1.addEventListener('click', () => {
    leftPlayer.name = prompt("Введите имя левого игрока", "Bandit");
    showStats();
});
name_2.addEventListener('click', () => {
    rightPlayer.name = prompt("Введите имя правого игрока", "Soldier");
    showStats();
});

//отображаем статы персонажей
function showStats() {
    let statName_1 = document.querySelector('.opp_1_stats__name').innerText = `name: \n${leftPlayer.name}`;
    let statArmor_1 = document.querySelector('.opp_1_stats__armor').innerText = `armor: \n${leftPlayer.armor.name}`;
    let statWeapon_1 = document.querySelector('.opp_1_stats__currentWeapon').innerText = `weapon: \n${leftPlayer.currentWeapon.name}`;
    let statMove_1 = document.querySelector('.opp_1_stats__move').innerText = `move: \n_${leftPlayer.movePoints}_`;
    let statAcc_1 = document.querySelector('.opp_1_stats__accuracy').innerText = `Acc: \n_${leftPlayer.accuracy}_`;
    let statMaxHealth_1 = document.querySelector('.opp_1_stats__maxHealth').innerText = `Max HP: \n_${leftPlayer.maxHealth}_`;
    let statRank_1 = document.querySelector('.opp_1_stats__rank').innerText = `rank: \n${leftPlayer.displayedRank}`;
    let statXp_1 = document.querySelector('.opp_1_stats__xp').innerText = `xp: \n_${leftPlayer.expirience}_`;
    let statHealth_1 = document.querySelector('.opp_1_stats__currentHealth').innerText = `HP: \n_${leftPlayer.currentHealth}_`;
    let statHeavyWounds_1 = document.querySelector('.opp_1_stats__heavyWounds').innerText = `Heavy Wounds: \n_${leftPlayer.heavyWounds}_`;
    let statDeadlyWounds_1 = document.querySelector('.opp_1_stats__deadlyWounds').innerText = `Deadly Wounds: \n_${leftPlayer.deadlyWounds}_`;
    let statShotsMade_1 = document.querySelector('.opp_1_stats__shotsMade').innerText = `Shots Made: \n_${shotsMadeLeft}_`;

    let statName_2 = document.querySelector('.opp_2_stats__name').innerText = `name: \n${rightPlayer.name}`;
    let statArmor_2 = document.querySelector('.opp_2_stats__armor').innerText = `armor: \n${rightPlayer.armor.name}`;
    let statWeapon_2 = document.querySelector('.opp_2_stats__currentWeapon').innerText = `weapon: \n${rightPlayer.currentWeapon.name}`;
    let statMove_2 = document.querySelector('.opp_2_stats__move').innerText = `move: \n_${rightPlayer.movePoints}_`;
    let statAcc_2 = document.querySelector('.opp_2_stats__accuracy').innerText = `Acc: \n_${rightPlayer.accuracy}_`;
    let statMaxHealth_2 = document.querySelector('.opp_2_stats__maxHealth').innerText = `Max HP: \n_${rightPlayer.maxHealth}_`;
    let statRank_2 = document.querySelector('.opp_2_stats__rank').innerText = `rank: \n${rightPlayer.displayedRank}`;
    let statXp_2 = document.querySelector('.opp_2_stats__xp').innerText = `xp: \n_${rightPlayer.expirience}_`;
    let statHealth_2 = document.querySelector('.opp_2_stats__currentHealth').innerText = `HP: \n_${rightPlayer.currentHealth}_`;
    let statHeavyWounds_2 = document.querySelector('.opp_2_stats__heavyWounds').innerText = `Heavy Wounds: \n_${rightPlayer.heavyWounds}_`;
    let statDeadlyWounds_2 = document.querySelector('.opp_2_stats__deadlyWounds').innerText = `Deadly Wounds: \n_${rightPlayer.deadlyWounds}_`;
    let statShotsMade_2 = document.querySelector('.opp_2_stats__shotsMade').innerText = `Shots Made: \n_${shotsMadeRight}_`;
};

showStats();
// let showStatsEverySec = setInterval(showStats, 1000);
// пока что можно навесить на выстрелы, нет глобальных событий и карты, выбора оружия и брони

// монстры могут попробовать сбежать при нанесении слишком большого разового урона, при появлении\увеличении тяжелых ран, при приближении смертельной раны

// FIXME: иногда не срабатывает код при нажатии на выстрел левого персонажа, само нажатие засчитывается