'use strict';
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
// функция стрельбы(сначала счиает меткость, затем производит прицельный выстрел или от бердра ткущим оружием атакующего игрока через броню защищающегося)
function accRoll(attPlayer, defPlayer, randomWound) {
    let totalAcc = Math.floor(Math.random()*6 + 1) + attPlayer.accuracy + attPlayer.currentWeapon.accuracy;
    if ( totalAcc >= 5 ) {
        alert("You can choose where to shoot -_-" + "\nПрицельная стрельба!")
        // ф-ии aimShot() и randomShot() ??
       
    } else if ( totalAcc > 1 && totalAcc <= 4 ) {
        alert("Random shot!" + "\nСтрельба от бедра.");
        takeAShot(attPlayer, defPlayer, randomWound)
        // attPlayer.checkRank(2);
        // defPlayer.checkRank(1);
        // defPlayer.checkWoundsCondition()
        // checkVictory();
    } else if ( totalAcc <= 1 ) {
        alert("You missed :(" + "\nПромах...")
    }
};

// заменить на randShot, внутри создать переменную randomWound и присвоить ей результат работы рандомайзера
function takeAShot (attPlayer, defPlayer, randomWound) {
    let dmg = attPlayer.currentWeapon.damage - defPlayer.armor.defence;
        if (dmg <= 0) {
            dmg = 1;
        };
    defPlayer.checkCondition(-dmg);
    attPlayer.checkCondition(0);
    // второй раз вызываем для изменения состояния атакующего персонажа на "живого", если это требуется после его смерти и влияния воли богов
    defPlayer.dmgTaken[randomWound] += dmg;
    attPlayer.checkRank(2);
    defPlayer.checkRank(1);
    checkWoundsCondition(defPlayer);
    checkVictory(); 
    return;
};

//получаем рандомное число от 0 до 5
function randomizerLeft () {
    let number = Math.floor(Math.random()*6 + 0);
    return number;
}
//получаем рандомное число от 6 до 11
function randomizerRight () {
    let number = Math.floor(Math.random()*6 + 6);
    return number;
}
//call after every shot or at low HP 
function checkVictory () {
    if (leftPlayer.isAlive == false) {
        alert(rightPlayer.name + " is victorious!")
    } else if (rightPlayer.isAlive == false) {
        alert(leftPlayer.name + " is victorious!")
    } else {
        alert(leftPlayer.currentHealth + " - " + rightPlayer.currentHealth + " \nKeep fighting!")
    }
};

// shotPermission = function (attPlayer, defPlayer) {
//     if (attPlayer.rank >= attPlayer.currentWeapon.availability) {
//         alert("You are shooting")
//         takeAShot(attPlayer, defPlayer)
//     } else {
//         alert("You cannot use this weapon yet.")
//         // прервать выполнение ф-ии, которая осуществляет бросок на выстрел
//     }
// };

//получаем рандомное число от 1 до 6
// console.log(Math.floor(Math.random()*6 + 1)); 

// Урон = урон оружия +-модификаторы + dmgRoll( )
// Точность(выбор КУДА стрелять) = точность оружия +-модификаторы + accRoll( )
// шанс заклинивания = стандартный шанс заклинивания +- шанс заклинивания используемого оружия(если есть) +-модификторы
