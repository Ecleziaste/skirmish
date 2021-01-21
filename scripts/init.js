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
    // checkWoundsCondition(defPlayer, i);
    // checkWoundsCondition(attPlayer);
    checkVictory();
    return;
};
// навешиваем цели и последствия от их поражения на левого 
for ( let i = 0; i <= 5; i++ ) {
    targets[i].addEventListener('click', () => {
        aimShot (rightPlayer, leftPlayer, i);
        let j = i;
        checkWoundsCondition ( leftPlayer , i , j );
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
    leftPlayer.dmgTaken = [0,0,0,0,0,0];
    rightPlayer.dmgTaken = [0,0,0,0,0,0];
    for ( let i = 0; i <= 5; i++ ) {
        let j = i;
        checkWoundsCondition ( leftPlayer , i , j);  
    }
    for ( let i = 0; i <= 5; i++ ) {
        let j = i+6;
        checkWoundsCondition ( rightPlayer , i , j);  
    }
    leftPlayer.currentHealth = leftPlayer.maxHealth;
    rightPlayer.currentHealth = rightPlayer.maxHealth;
    alert("Боги желают продолжения битвы!")
    console.log("Боги желают продолжения битвы!")
    return;
});

let healLeftHeadBtn = document.querySelector( '.opponent_1_heal_head' );
healLeftHeadBtn.addEventListener('click', () => {
    leftPlayer.dmgTaken[0] -= 2;
    checkWoundsCondition(leftPlayer, 0);
    leftPlayer.currentHealth += 2;
    // return;
});

let healRightHeadBtn = document.querySelector( '.opponent_2_heal_head' );
healRightHeadBtn.addEventListener('click', () => {
    rightPlayer.dmgTaken[0] -= 2;
    checkWoundsCondition(rightPlayer, 0);
    rightPlayer.currentHealth += 2;
    // return;
});



// вынесенная наружу из объекта функция проверки состояния объекта и окрашивания нужных целей
function checkWoundsCondition (that , i , j) {
    // if (this.dmgTaken[0] >= 1 && this.dmgTaken[0] <= 3) {
    //     targets[0].classList.add('.low_wound');
    // }
    // let j = i;
    if (that.dmgTaken[i] >= 1 && that.dmgTaken[0] <= 3) {
        targets[j].classList.add('low_wound');
        targets[j].classList.remove('medium_wound', 'heavy_wound');
    }
    if (that.dmgTaken[i] >= 4 && that.dmgTaken[0] <= 6) {
        targets[j].classList.add('medium_wound');
        targets[j].classList.remove('low_wound', 'heavy_wound');
    }
    if (that.dmgTaken[i] >= 7) {
        targets[j].classList.add('heavy_wound');
        targets[j].classList.remove('low_wound', 'medium_wound');
    }
    if (that.dmgTaken[i] == 0) {
        targets[j].classList.remove('low_wound', 'medium_wound', 'heavy_wound');
    }
};

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

