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
        if (attPlayer.currentWeapon.type == "smg") {
            alert("Take one more shot at any bodypart")
        }
        if (attPlayer.currentWeapon.type == "shotgun") {
            alert("Take a shot in another bodypart")
            let randomWound = randomizerLeft();
            randShot(attPlayer, defPlayer, randomWound)
            // реализовать рандомную стрельбу после прицеьного выстрела
        }   
    } else if ( totalAcc > 1 && totalAcc <= 4 ) {
        alert("Random shot!" + "\nСтрельба от бедра.");
        randShot(attPlayer, defPlayer, randomWound)
        if (attPlayer.currentWeapon.type == "smg") {
            let randomWound = randomizerLeft();
            randShot(attPlayer, defPlayer, randomWound)
        }
        if (attPlayer.currentWeapon.type == "shotgun") {
            let randomWound = randomizerLeft();
            randShot(attPlayer, defPlayer, randomWound)
        }
    } else if ( totalAcc <= 1 ) {
        alert("You missed :(" + "\nПромах...")
    }
};

// заменить на randShot, внутри создать переменную randomWound и присвоить ей результат работы рандомайзера
function randShot (attPlayer, defPlayer, randomWound) {
    let dmg = attPlayer.currentWeapon.damage - defPlayer.armor.defence;
        if (dmg <= 0) {
            dmg = 1;
        };  
    defPlayer.checkCondition(-dmg);
     // второй раз вызываем для изменения состояния атакующего персонажа на "живого", если это требуется после его смерти и влияния воли богов
    attPlayer.checkCondition(0);
    // меняем состояние части тела, куда попала пуля   
    defPlayer.dmgTaken[randomWound] += dmg;

    let paintWound = 0;
    let dmgBodypart = 0;
    if (defPlayer === rightPlayer) {
        dmgBodypart = randomWound;
        paintWound = randomWound + 6;
    } else if (defPlayer === leftPlayer) {
        dmgBodypart = randomWound;
        paintWound = randomWound;
    }

    checkWoundsCondition(defPlayer, dmgBodypart, paintWound);
        //запускаем метод, считающий штрафы от ран внутри объекта   
        defPlayer.changeAccuracy();
    attPlayer.checkRank(2);
    defPlayer.checkRank(1);
    showHealth ();
    checkVictory(); 
    return;
};

// работа прицельных выстрелов. ф-ия НЕ читалась из battle.js
function aimShot (attPlayer, defPlayer, i) {
    let dmg = attPlayer.currentWeapon.damage - defPlayer.armor.defence;
        if (dmg <= 0) {
            dmg = 1;
        };
    defPlayer.checkCondition(-dmg);
    attPlayer.checkCondition(0);
    defPlayer.dmgTaken[i] += dmg;

    attPlayer.checkRank(2);
    defPlayer.checkRank(1);
    showHealth();
    checkVictory();
};
// вынесенная наружу из объекта функция проверки состояния объекта и окрашивания нужных целей + проверки и реализации последствий от ран
// that - это тот, В КОГО стреляют(объект)
function checkWoundsCondition (that , i , j) {
    if (that.dmgTaken[i] <= 0) {
        targets[j].classList.remove('low_wound','medium_wound', 'heavy_wound');
    }
    if (that.dmgTaken[i] >= 1 && that.dmgTaken[i] <= 3) {
        targets[j].classList.add('low_wound');
        targets[j].classList.remove('medium_wound', 'heavy_wound');
    }
    if (that.dmgTaken[i] >= 4 && that.dmgTaken[i] <= 6) {
        targets[j].classList.add('medium_wound');
        targets[j].classList.remove('low_wound', 'heavy_wound');
    }
    if (that.dmgTaken[i] >= 7) {
        targets[j].classList.add('heavy_wound');
        targets[j].classList.remove('low_wound', 'medium_wound');
        that.heavyWounds += 1;
        // that.checkCondition(0);
        checkVictory();
    }
    that.changeAccuracy(0);
    // // повреждения торса
    // if (that.dmgTaken[2] == 0) {
    //     that.accuracy = that.defaultAccuracy + that.modAccuracy;
    // } else if (that.dmgTaken[2] >= 4 && that.dmgTaken[0] <= 6) {
    //     that.accuracy = that.defaultAccuracy + that.modAccuracy -(0.5);
    //     console.log(that.accuracy)
    // } else if (that.dmgTaken[2] >= 7) {
    //     that.accuracy = that.defaultAccuracy + that.modAccuracy -1;
    //     console.log(that.accuracy)
    // }
    // // повреждения правой и левой ног
    // if (that.dmgTaken[4] == 0) {
    //     that.accuracy = that.defaultAccuracy + that.modAccuracy;
    // } else if (that.dmgTaken[4] >= 4 && that.dmgTaken[0] <= 6) {
    //     that.accuracy = that.defaultAccuracy + that.modAccuracy -(0.5);
    //     console.log(that.accuracy)
    // } else if (that.dmgTaken[4] >= 7) {
    //     that.accuracy = that.defaultAccuracy + that.modAccuracy -1;
    //     console.log(that.accuracy)
    // }

    // if (that.dmgTaken[5] == 0) {
    //     that.accuracy = that.defaultAccuracy + that.modAccuracy;
    // } else if (that.dmgTaken[5] >= 4 && that.dmgTaken[0] <= 6) {
    //     that.accuracy = that.defaultAccuracy + that.modAccuracy -(0.5);
    //     console.log(that.accuracy)
    // } else if (that.dmgTaken[5] >= 7) {
    //     that.accuracy = that.defaultAccuracy + that.modAccuracy -1;
    //     console.log(that.accuracy)
    // }

};
// function changeAccuracy (that) {
    
//     let modAccuracyHead = 0;
//     let modAccuracyRightHand = 0;
//     let modAccuracyLeftHand = 0;
//     // повреждения головы
//     if (that.dmgTaken[0] == 0) {
//         modAccuracyHead = 0;
//         console.log(that.accuracy);  
//     } else if (that.dmgTaken[0] >= 4 && that.dmgTaken[0] <= 6) {
//         modAccuracyHead = -0.5;
//         console.log(that.accuracy);
//     } else if (that.dmgTaken[0] >= 7) {
//         modAccuracyHead = -1;
//         console.log(that.accuracy)
//     }   
    
//     // повреждения правой и левой рук
//     if (that.dmgTaken[1] == 0) {
//         modAccuracyRightHand = 0;
//         // console.log(that.accuracy);
//     } else if (that.dmgTaken[1] >= 4 && that.dmgTaken[0] <= 6) {
//         modAccuracyRightHand = -0.25;
//         // console.log(that.accuracy)
//     } else if (that.dmgTaken[1] >= 7) {
//         modAccuracyRightHand = -0.5;
//         // console.log(that.accuracy)
//     }

//     if (that.dmgTaken[3] == 0) {
//         modAccuracyLeftHand = 0;
//         // console.log(that.accuracy);
//     } else if (that.dmgTaken[3] >= 4 && that.dmgTaken[0] <= 6) {
//         modAccuracyLeftHand = -0.25;
//         // console.log(that.accuracy);
//     } else if (that.dmgTaken[3] >= 7) {
//         modAccuracyLeftHand = -0.5;
//         // console.log(that.accuracy);
//     }

//     modAccuracy = modAccuracyHead + modAccuracyRightHand + modAccuracyLeftHand;
//     return that.accuracy += modAccuracy;
// };
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
    leftPlayer.checkCondition(0);
    rightPlayer.checkCondition(0);
    if (leftPlayer.isAlive == false) {
        alert(rightPlayer.name + " is victorious!")
    } else if (rightPlayer.isAlive == false) {
        alert(leftPlayer.name + " is victorious!")
    }
    //  else {
    //     alert(leftPlayer.currentHealth + " - " + rightPlayer.currentHealth + " \nKeep fighting!")
    // }
};

function showHealth () {
    // leftPlayer.checkCondition(0);
    // rightPlayer.checkCondition(0);
    alert(leftPlayer.name + ' with ' + leftPlayer.currentWeapon.name + ' HP = ' + leftPlayer.currentHealth + " \nvs "
     + "\n" + rightPlayer.name + ' with ' + rightPlayer.currentWeapon.name + ' HP = ' + rightPlayer.currentHealth + " \nKeep fighting!");
};
// shotPermission = function (attPlayer, defPlayer) {
//     if (attPlayer.rank >= attPlayer.currentWeapon.availability) {
//         alert("You are shooting")
//         randShot(attPlayer, defPlayer)
//     } else {
//         alert("You cannot use this weapon yet.")
//         // прервать выполнение ф-ии, которая осуществляет бросок на выстрел
//     }
// };

// игроки всё ещё могут стрелять с того ствета, нужно обнулять урон текущего оружия до 0 или воздейтсовать на функцию shotPermission,
// которая в принципе должна позволять или запрещать стрелять из текущего оружия в руках(проверка currentWeapon объекта)

//получаем рандомное число от 1 до 6
// console.log(Math.floor(Math.random()*6 + 1)); 

// Урон = урон оружия +-модификаторы + dmgRoll( )
// Точность(выбор КУДА стрелять) = точность оружия +-модификаторы + accRoll( )
// шанс заклинивания = стандартный шанс заклинивания +- шанс заклинивания используемого оружия(если есть) +-модификторы
