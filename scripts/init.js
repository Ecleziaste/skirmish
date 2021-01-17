let startingArmor = new Armor ("jacket");
let startingWeapon = new Weapon ("Pistol");

let leftPlayer = new Humanoid("Bandit", startingWeapon, startingArmor);
let rightPlayer = new Humanoid("Soldier", startingWeapon, startingArmor);

//TODO: получить доступ к разным частям тела и их состоянию ранинрования
// должно быть максимальное количество HP
let target = document.querySelectorAll( '.bodyparts' );
let targets = Array.from( target );
// let targets = new Array( document.querySelectorAll( 'bodyparts' ) );

// targets[0-5] для leftPlayer
// targets[6-10] для righttPlayer

// создать в каждом bodyparts элементе dmgSuffered = 0;
// в них будет копиться нанесенный урон и соответсвенно добавляться\убираться классы для окрашивания блоков с частями тела

