'use strict';
// FUNCTIONS
// функция стрельбы(сначала счиает меткость, затем производит прицельный выстрел или от бердра ткущим оружием атакующего игрока через броню защищающегося)
function accRoll(attPlayer, defPlayer, randomWound) {
    let totalAcc = ( randomizerZeroFive() + 1)  + attPlayer.accuracy + attPlayer.currentWeapon.accuracy;
    // можно сделать стандартную меткость персонажей = 2 и добавить Math.floor(attPlayer.accuracy), для более драматического влияния попаданий
    // на меткость, но после достижения нуля это может работать в обратном направлении, ибо Math.floor() округляет до ближайшего наименьшего целого?
    // хотя, -2 < -1 < 0 , need a test
    if ( totalAcc >= 5 ) {
        if (attPlayer.currentWeapon.type == "smg") {
            alert("You can shoot TWICE at ANY bodypart -_-" + "\nПрицельная стрельба по ДВУМ ЛЮБЫМ частям тела!")
        } else if (attPlayer.currentWeapon.type == "shotgun") {
            alert("Shoot ONCE to ANOTHER bodypart after random shot -_-")
            let randomWound = randomizerZeroFive();
            randShot(attPlayer, defPlayer);
            // реализовать рандомную стрельбу после прицеьного выстрела
        } else {
            alert("You can choose where to shoot ONCE -_-" + "\nПрицельная стрельба по ОДНОЙ части тела!")
        }   
    } else if ( totalAcc > 1 && totalAcc <= 4 ) {
        alert("Random shot!" + "\nСтрельба от бедра.");
        if (attPlayer.currentWeapon.type == "smg") {
            randShot(attPlayer, defPlayer);
            randShot(attPlayer, defPlayer);
        } else if (attPlayer.currentWeapon.type == "shotgun") {
            randShot(attPlayer, defPlayer);
            randShot(attPlayer, defPlayer);
        } else {
            randShot(attPlayer, defPlayer);
        }
    } else if ( totalAcc <= 1 ) {
        alert("You missed :(" + "\nПромах...");
    }
};

// ф-ия рандомного выстрела
function randShot (attPlayer, defPlayer) {
    let randomWound = randomizerZeroFive();
    defPlayer.hvyWndCheck();
    let dmg = attPlayer.currentWeapon.damage - defPlayer.armor.defence;
        if (dmg <= 0) {
            dmg = 1;
        };  
    defPlayer.checkCondition(-dmg);
     // второй раз вызываем для изменения состояния атакующего персонажа на "живого", если это требуется после его смерти и влияния воли богов
    attPlayer.checkCondition(0);
    // меняем состояние части тела, куда попала пуля   
    defPlayer.dmgTaken[randomWound] += dmg;
    defPlayer.additionalDmg(randomWound);

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

    shotAftermath(attPlayer, defPlayer); 
};

// работа прицельного выстрела
function aimShot (attPlayer, defPlayer, bodypart) {
    defPlayer.hvyWndCheck();
    let dmg = attPlayer.currentWeapon.damage - defPlayer.armor.defence;
        if (dmg <= 0) {
            dmg = 1;
        };
    defPlayer.checkCondition(-dmg);
    attPlayer.checkCondition(0);
    defPlayer.dmgTaken[bodypart] += dmg;
    defPlayer.additionalDmg(bodypart);
 
    shotAftermath(attPlayer, defPlayer);
};
// последствия от выстрела
function shotAftermath (attaker, attaked) {
    attaker.checkRank(2);
    attaked.checkRank(1);
    attaked.changeAccuracy(0);
    attaked.changeMobility(0); 
    attaked.changeHealth(0);
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
        // that.heavyWounds += 1;
        // как добавить в объект heavyWounds += 1 ЕДИНОЖДЫ? Мб переделать всё же отрисовку ран для каждого игрока(разделить массив targets на 2 разных массива и брать оттуда инфу)
        //FIXME:   !!  This is Brutal mode - смерть при двух попаданиях в тяжелую рану  !!  следует вынести в ф-ию
        // that.checkCondition(0);
        checkVictory(); 
        // проверяем на победу, ибо 3 тяжелые раны приравниваются к смерти
    }
};

//получаем рандомное число от 0 до 5
function randomizerZeroFive () {
    let number = Math.floor(Math.random()*6 + 0);
    return number;
}
//получаем рандомное число от 6 до 11
// function randomizerRight () {
//     let number = Math.floor(Math.random()*6 + 6);
//     return number;
// }

//call after every shot or at low HP 
function checkVictory () {
    leftPlayer.checkCondition(0);
    rightPlayer.checkCondition(0);
// FIXME: мб не стоит тут вызывать?
    if (leftPlayer.isAlive == false) {
        alert(rightPlayer.name + " is victorious!")
    } else if (rightPlayer.isAlive == false) {
        alert(leftPlayer.name + " is victorious!")
    }
};

function showHealth () {
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
