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

// работа прицельных выстрелов. ф-ия НЕ читалась из battle.js вероятно из-за стрелочных ф-ий в клике. зато клик не навязывает свой this
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
    defPlayer.checkWoundsCondition()
    checkVictory();
    return;
};
// навешиваем цели на левого
for ( let i = 0; i <= 5; i++ ) {
    targets[i].addEventListener('click', () => {
        aimShot (rightPlayer, leftPlayer, i)
    });
}
// навешиваем цели на правого
for ( let i = 0; i <= 5; i++ ) {
    targets[i+6].addEventListener('click', () => {
        aimShot (leftPlayer, rightPlayer, i)
    });
}
// воля богов (хилим всех и обнуляем состояния ран)
let healButton = document.querySelector( '.heal_all' );
healButton.addEventListener('click', () => {
    leftPlayer.dmgTaken = [0,0,0,0,0,0];
    rightPlayer.dmgTaken = [0,0,0,0,0,0];
    leftPlayer.checkWoundsCondition();
    rightPlayer.checkWoundsCondition();
    leftPlayer.currentHealth = leftPlayer.maxHealth;
    rightPlayer.currentHealth = rightPlayer.maxHealth;
    alert("Боги желают продолжения битвы!")
    console.log("Боги желают продолжения битвы!")
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

