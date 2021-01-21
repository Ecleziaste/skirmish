'use strict';

// class Humanoid {
//     constructor(name) {
//         this.name = name;
//         this.health = 20;
//         this.isAlive = true;
//         this.rank = "rookie";
//     }
// };

// КОНСТРУКТОР ЧЕЛОВЕКООБРАЗНЫХ ПЕРСОНАЖЕЙ
function Humanoid ( name, weapon, armor, weaponToEquip ) {
    this.name = name;
    this.armor = armor;
    this.currentWeapon = weapon;
    this.accuracy = 1;
    this.move = 4;
    // кол-во ходов по карте. отнимается за передвижение и действия, когда равно нулю - пояляется кнопка ЗАКОНЧИТЬ ХОД(ф-ия передачи хода другому игроку)
    this.weaponCapacity = 0;
    // this.equippedWeapons = function ( weapon ) {
    //     return weapon.capacity;
    // };
    
    // this.weaponCapacity = function ( weaponToEquip ) {
    //     this.weaponCapacity += capacity;
    //     if (this.weaponCapacity <= 10) {
    //         return
    //     }
    //     else {
    //         alert("Weapon capacity exceeded")
    //         // прервать выполнение ф-ии, которая добавляет принимаемое оружие в экипированное для боя
    //     }
    // } ;
    // weaponCapacity = max 10 . орпделеяет сколько пушек можно быстро менять в бою вместо выстрела
    // малогабаритное занимает 3 очка, среднее 4 очка, крупное 6 очков, граната 1.
    // 3 малогабаритных вида оружия,
    // 2 малогабаритных вида оружия и 1 среднегабаритное, 
    // 2 среднегабаритных, 
    // 1 малогабаритное и 1 крупногабаритное.
    // метод стрельбы. берет урон из current weapon + модификаторы и отнибает из него бронь,
    //  полученное значение: прибавляется в часть тела куда стреляли; отнимает здоровье из currentHealth

    this.maxHealth = 30;
    this.currentHealth = 30;
    this.isAlive = true;
    this.dmgTaken = [0,0,0,0,0,0];
    // МБ ПРОСТО СДЕЛАТЬ МАССИВ С НУЛЯМИ и ориентироваться. так и так смогу
    // this.dmgTaken = {
    //     head : 0,
    //     rightHand : 0,
    //     torso : 0,
    //     leftHand : 0,
    //     rightLeg : 0,
    //     leftLeg : 0,
    // };

    // this.checkWoundsCondition = function () {
    //     // if (this.dmgTaken[0] >= 1 && this.dmgTaken[0] <= 3) {
    //     //     targets[0].classList.add('.low_wound');
    //     // }
    //     if (this.dmgTaken[0] >= 1 && this.dmgTaken[0] <= 3) {
    //         targets[0].classList.add('low_wound');
    //         targets[0].classList.remove('medium_wound', 'heavy_wound');
    //     }
    //     if (this.dmgTaken[0] >= 4 && this.dmgTaken[0] <= 6) {
    //         targets[0].classList.add('medium_wound');
    //         targets[0].classList.remove('low_wound', 'heavy_wound');
    //     }
    //     if (this.dmgTaken[0] >= 7) {
    //         targets[0].classList.add('heavy_wound');
    //         targets[0].classList.remove('low_wound', 'medium_wound');
    //     }
    //     if (this.dmgTaken[0] == 0) {
    //         targets[0].classList.remove('low_wound', 'medium_wound', 'heavy_wound');
    //     }
    //  };  

    // считает дамаг повреждаемой части тела тела и меняет класс в html. Нужно снижать this.accuracy -= 1 за повреждение головы и обеих рук средней раной.
    // + снижать this.move -= 1 за тяжелые ранения ног и шанс сбежать из боя в runawayRoll()
    //  цикл с условиями (МБ ТУТ ПРЕВРАЩАТЬ ОБЪЕКТ В МАССИВ а возвращать значения объекта?)
    // ХОТЯ всё равно надо бдует манипулировать классами разных частей тела разных оппонентов, пока сойдет повторяющийся код
    
    // 3 heavyWounds ведет к смерти. нужно плюсовать сюда значения тяжелых ран, то бишь как-то получать их соостояние из надамаженных частей
    // + добавлять класс тяжелых ран в элемент для окраски
    this.heavyWounds = 0;
    // смертельная рана - становится 1, когда попадают в тяжелую рану(убивает игрока) метод brutalDeath() {return defendingPlayer.isAlive = false;}
    // можно сделать просто +5 к дамагу, если попали в тяжелую рану еще раз(это лучше тестить, когда будет доступно леченеи бинтами и аптечками, стимуляторами)
    // метод brutalDamage() {return defendingPlayer.currentHealth -= 5;}
    this.deadlyWounds = 0;
    // проверка состояния игрока после событий
    this.checkCondition = function ( hp ) {
        this.currentHealth += hp;
        if ( this.currentHealth > this.maxHealth ) {
            this.currentHealth = this.maxHealth;
            return this.currentHealth;
        };
        if ( this.currentHealth === 0 ) {
            this.isAlive = false;
            return this.isAlive;
        };
        if ( this.currentHealth > 0 ) {
            this.isAlive = true;
            return this.isAlive;
        };
        if ( this.heavyWounds === 3 ) {
            this.isAlive = false;
            return this.isAlive;
        };
        if ( this.deadlyWounds === 1 ) {
            this.isAlive = false;
            return this.isAlive;
        }; 
    };

    
    this.expirience = 0;
    this.rank = 1;
    this.displayedRank = "Rookie";
    //TODO: Ф-ИЯ для проверки на доступность оружия для текущего ранга игрока, ВЫЗОВ ПЕРЕД выстрелом мб делать??
    // this.shotPermission = function ( currentWeapon ) {
    //     if (this.rank >= currentWeapon.availability) {
    //         return currentWeapon;
    //     } else {
    //         alert("You cannot use this weapon yet.")
    //         // прервать выполнение ф-ии, которая осуществляет бросок на выстрел
    //     }
    // };
    // TODO: и восстанавливается здоровье до текущей величины, воздействуя на currentHealth ?
    this.checkRank = function ( xp ){
        this.expirience += xp;
        if ( this.expirience <= 19 ) {
            this.rank = 1;
            this.displayedRank = "Rookie"
            this.maxHealth = 30;
            return;
        } else if ( this.expirience >= 20 && this.expirience <= 49 ) {
            this.rank = 2;
            this.displayedRank = "Skilled";
            this.maxHealth = 35;
            return;
        } else if ( this.expirience >= 50 && this.expirience <= 99 ) {
            this.rank = 3;
            this.displayedRank = "Veteran";
            this.maxHealth = 40;
            return;
        } else {
            this.rank = 4;
            this.displayedRank = "Master";
            this.maxHealth = 45;
            return;
        }   
    };
  
};


// навешиваем на бодипартс листенеры со счетчикоммм
// СЧЕТЧИК РАН НА ЗАМЫКАНИИ ЫЫЫЫЫЫЫЫЫЫЫЫЫЫ БЛЯ


// КОНСТРУКТОР ОРУЖИЯ
function Weapon ( name ) {
    this.name = name;
    this.type = "pistol";
    this.capacity = 3;
    // this.weaponCapacity = 3;
    // должно заполнять количество слотов в массиве(или просто в переменной считается) weaponCapacity в объекте игрока
    this.oneHanded = true;
    this.size = 1;
    // количество слотов в массиве предметов Inventory
    this.availability = 1;
    this.availabilityDisplay = "for Rookie";
    this.damage = 3;
    this.accuracy = 0;
    this.jamming = 0;
    // this.takeAShot = function () {
    //     if (this.shotPermission() == true) {

    //     } else {
    //         alert("Shot has been failed.")
    //     }
    // }

};

// КОНСТРУКТОР БРОНИ
function Armor ( name ) {
    this.name = name;
    // this.availability = 1;
    // this.availabilityDisplay = "for Rookie";
    this.defence = 1;
    // для разных частей тела физ защиту реализовать
    this.chemDefence = 1;
}

function Inventory ( item ) {
    this.items = {};
    this.items = [];
    // тут методы itemRemove() и item(add) должны пихать и доставать из массива(объекта) размером 9 итемы
    // сделать проверку if items length == 9 мы блокируем добавление нвых итемов
}

// Урон = урон оружия +-модификаторы + dmgRoll( )
// Точность(выбор КУДА стрелять) = точность оружия +-модификаторы + accRoll( )
// шанс заклинивания = стандартный шанс заклинивания +- шанс заклинивания используемого оружия(если есть) +-модификторы