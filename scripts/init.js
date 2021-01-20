'use strict';
//создание экземпляров оружия и брони
let startingArmor = new Armor ("jacket");
let startingWeapon = new Weapon ("Pistol");
//создание 2 оппонентов (левого и правого - названо для удобства разработки)
let leftPlayer = new Humanoid("Bandit", startingWeapon, startingArmor);
let rightPlayer = new Humanoid("Soldier", startingWeapon, startingArmor);

let target = document.querySelectorAll( '.bodyparts' );
let targets = Array.from( target );
// let targets = new Array( document.querySelectorAll( '.bodyparts' ) );
// function targetsIncrease (i, dmg){
//     leftPlayer.dmgTaken[i] += dmg;
//     return leftPlayer.dmgTaken[i];   
// };
// работа прицельных выстрелов по левому стрелку
for ( let i = 0; i <= 5; i++ ) {
    // const attPlayer = rightPlayer;
    // const defPlayer = leftPlayer;
    targets[i].addEventListener('click', function (i) {
        aimShot (rightPlayer, leftPlayer, i)
        return;
        // let dmg = attPlayer.currentWeapon.damage - defPlayer.armor.defence;
        // if (dmg <= 0) {
        //     dmg = 1;
        // };
        // defPlayer.checkCondition(-dmg);
        // // defPlayer.dmgTaken[randomWound] += dmg; 
        // defPlayer.dmgTaken[i] += dmg;
        // attPlayer.checkRank(2);
        // defPlayer.checkRank(1);
        // defPlayer.checkWoundsCondition()
        // checkVictory();
        // return;

        // // function aimShot (attPlayer, defPlayer, i);
        // let dmg = attPlayer.currentWeapon.damage - defPlayer.armor.defence;
        // if (dmg <= 0) {
        //     dmg = 1;
        // };
        // defPlayer.checkCondition(-dmg);
        // defPlayer.dmgTaken[randomWound] += dmg; 
        // // targetsIncrease(i, dmg);
        // leftPlayer.dmgTaken[i] += dmg;
        // rightPlayer.checkRank(2);
        // leftPlayer.checkRank(1);
        // leftPlayer.checkWoundsCondition()
        // checkVictory();
        // return;
    });
};




// targets[1].addEventListener('click', function () {
//     // let j = 0;
//     let dmg = 0;
//     takeAShot(rightPlayer, leftPlayer, dmg);
//     // targetsIncrease (i)
//     leftPlayer.dmgTaken[4] += dmg;
//     rightPlayer.checkRank(2);
//     leftPlayer.checkRank(1);
//     leftPlayer.checkWoundsCondition()
//     checkVictory();
//     return;
// });

// for ( let i = 0; i <= 5; i++ ) {
//         let index = i;
//     targets[i].addEventListener('click', aimShotLeft(index));

// };

// function aimShotLeft (index) {
//         let dmg = 0;
//         takeAShot(rightPlayer, leftPlayer, dmg);
//         leftPlayer.dmgTaken[index] += dmg;
//         rightPlayer.checkRank(2);
//         leftPlayer.checkRank(1);
//         leftPlayer.checkWoundsCondition()
//         checkVictory();
//         return;
// }

// !!!!!!!!!!
//TODO: // НАВЕШАТЬ ЦИКЛОМ эвент листенеры на массив таргетс с передаваемыми 0-11 в функцию прицельного выстрела. она должна в обхекта повышать рану определенную и онимать каррент хелс на ту же величину
// !!!!!!!!!!!
let healButton = document.querySelector( '.heal_all' );
healButton.addEventListener('click', () => {
    // for ( let targetsIndex = 0; targetsIndex < targets.length; targetsIndex++  ) {
    //     targets[targetsIndex].dmgTaken = 0;
    // }
    //надо этим фором воздействовать на объект(будущий массив если не найду нужного метода) и обнулять значения ключей
    leftPlayer.dmgTaken = [0,0,0,0,0,0];
    rightPlayer.dmgTaken = [0,0,0,0,0,0];
    leftPlayer.currentHealth = leftPlayer.maxHealth;
    rightPlayer.currentHealth = rightPlayer.maxHealth;
    alert("Боги хотят продолжения битвы!")
    console.log("Боги хотят продолжения битвы!")
    return;
});

// {/* <div class="opponent_1_right_hand bodyparts">Hand</div>
//                     <div class="opponent_1_torso bodyparts">Torso</div>
//                     <div class="opponent_1_left_hand bodyparts">Hand</div>
//                 </div>
//                 <div class="opponent_1_bottom">
//                     <div class="opponent_1_right_leg bodyparts">Leg</div>
//                     <div class="opponent_1_left_leg bodyparts">Leg</div> */}
// targets[0-5] для leftPlayer
// targets[6-11] для righttPlayer
// надо плясать от объектов, чтобы в будущем там хранились данные о ранах, не в хтмл жее!

// создать в каждом bodyparts элементе dmgSuffered = 0;
// в них будет копиться нанесенный урон и соответсвенно добавляться\убираться классы для окрашивания блоков с частями тела

