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
            let randomWound = randShot(attPlayer, defPlayer);
            // чтобы понимать, куда попал случайный выстрел, randomWound приходит ретёрном из randShot выше
            showDamagedBodypart (randomWound, attPlayer, defPlayer);
            // реализовать рандомную стрельбу после прицельного выстрела
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
}

// ф-ия рандомного выстрела
function randShot (attPlayer, defPlayer) {
    let randomWound = randomizerZeroFive();
    defPlayer.hvyWndCheck();
    // урон при попадании. не может быть меньше единицы
    let dmg = attPlayer.currentWeapon.damage - defPlayer.armor.bulletDef[randomWound] || 1; 
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

    defPlayer.checkWoundsCondition(dmgBodypart, paintWound);
    // checkWoundsCondition(defPlayer, dmgBodypart, paintWound);

    shotAftermath(attPlayer, defPlayer);
    return randomWound; 
}

// работа прицельного выстрела
function aimShot (attPlayer, defPlayer, bodypart) {
    defPlayer.hvyWndCheck();
    let dmg = attPlayer.currentWeapon.damage - defPlayer.armor.bulletDef[bodypart] || 1;

    defPlayer.checkCondition(-dmg);
    attPlayer.checkCondition(0);
    defPlayer.dmgTaken[bodypart] += dmg;
    defPlayer.additionalDmg(bodypart);
 
    shotAftermath(attPlayer, defPlayer);
}
// последствия от выстрела
function shotAftermath (attaker, attaked) {
    attaker.checkRank(2);
    attaked.checkRank(1);
    attaked.changeAccuracy(0);
    attaked.changeMobility(0); 
    attaked.changeHealth(0);
    showHealth();
    checkVictory();
}

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
    //  else (console.log("No one is victorious yet."))
}

function showHealth () {
    alert(leftPlayer.name + ' with ' + leftPlayer.currentWeapon.name + ' HP = ' + leftPlayer.currentHealth + " \nvs "
     + "\n" + rightPlayer.name + ' with ' + rightPlayer.currentWeapon.name + ' HP = ' + rightPlayer.currentHealth + " \nKeep fighting!");
}
// TODO: switch \ case mb?
function showDamagedBodypart (bodypart, attPlayer, defPlayer) {
    if ( bodypart == 0 ) {console.log(`${attPlayer.name} damaged ${defPlayer.name}'s HEAD`)}
    else if ( bodypart == 1 ) {console.log(`${attPlayer.name} damaged ${defPlayer.name}'s Right Hand`)}
    else if ( bodypart == 2 ) {console.log(`${attPlayer.name} damaged ${defPlayer.name}'s Torso`)}
    else if ( bodypart == 3 ) {console.log(`${attPlayer.name} damaged ${defPlayer.name}'s Left Hand`)}
    else if ( bodypart == 4 ) {console.log(`${attPlayer.name} damaged ${defPlayer.name}'s Right Leg`)}
    else {console.log(`${attPlayer.name} damaged ${defPlayer.name}'s Left leg`)}
}
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
