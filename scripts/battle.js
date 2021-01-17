const leftShot = document.querySelector ('.opponent_1_shot');
const rightShot = document.querySelector ('.opponent_2_shot');

leftShot.addEventListener('click', () => {
    takeAShot(leftPlayer, rightPlayer);
});

rightShot.addEventListener('click', () => {
    takeAShot(rightPlayer, leftPlayer);
});

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

function accRoll(attackingPlayer) {
    let totalAcc = Math.floor(Math.random()*6 + 1) + attackingPlayer.accuracy + attackingPlayer.currentWeapon.accuracy;
    if ( totalAcc >= 5 ) {
        alert("You can choose where to shoot -_-")
    }
};
// shotPermission = function (attackingPlayer, defendingPlayer) {
//     if (attackingPlayer.rank >= attackingPlayer.currentWeapon.availability) {
//         alert("You are shooting")
//         takeAShot(attackingPlayer, defendingPlayer)
//     } else {
//         alert("You cannot use this weapon yet.")
//         // прервать выполнение ф-ии, которая осуществляет бросок на выстрел
//     }
// };

//получаем рандомное число от 1 до 6
// console.log(Math.floor(Math.random()*6 + 1)); 


takeAShot = function (attackingPlayer, defendingPlayer) {
    accRoll(attackingPlayer);
    let dmgTaken = attackingPlayer.currentWeapon.damage - defendingPlayer.armor.defence;
        if (dmgTaken <= 0) {
            dmgTaken = 1;
        };
    defendingPlayer.checkCondition(-dmgTaken);
    attackingPlayer.checkRank(2);
    defendingPlayer.checkRank(1);
    checkVictory();  
    return;

};

// shotPermission(leftPlayer, rightPlayer);
// takeAShot(leftPlayer, rightPlayer);

// Урон = урон оружия +-модификаторы + dmgRoll( )
// Точность(выбор КУДА стрелять) = точность оружия +-модификаторы + accRoll( )
// шанс заклинивания = стандартный шанс заклинивания +- шанс заклинивания используемого оружия(если есть) +-модификторы