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
function Humanoid ( name, weapon, armor, items, weaponToEquip, itemToEquip, itemToInventory, perks ) {
    this.name = name;
    this.armor = armor;
    this.currentWeapon = weapon;
    // начальная точность персонажа, относительно постоянная величина 
    this.defaultAccuracy = 1;
    // модифицировання точность от ран или в ходе боя, временные модификаторы плюсуются сюда же(сделать более независимой о)
    this.modAccuracy = 0;
    // фактическая точность
    this.accuracy = this.defaultAccuracy + this.modAccuracy;
    // this.modAccuracyHead = 0;
    // this.modAccuracyRighthand = 0;
    // this.modAccuracyLeftHand = 0;
    this.changeAccuracy = function (modifier) {
        // вызывать каждый раз, когд что-то влияет на точность?
        let modAccuracyHead = 0;
        let modAccuracyRightHand = 0;
        let modAccuracyLeftHand = 0;
        // проверка повреждений головы
        if (this.dmgTaken[0] == 0) {
            modAccuracyHead = 0; 
        } else if (this.dmgTaken[0] >= 4 && this.dmgTaken[0] <= 6) {
            modAccuracyHead = -0.5;
        } else if (this.dmgTaken[0] >= 7) {
            modAccuracyHead = -1;
        }   
        // повреждения правой и левой рук
        if (this.dmgTaken[1] == 0) {
            modAccuracyRightHand = 0;
            // console.log(this.accuracy);
        } else if (this.dmgTaken[1] >= 4 && this.dmgTaken[1] <= 6) {
            modAccuracyRightHand = -0.25;
            // console.log(this.accuracy)
        } else if (this.dmgTaken[1] >= 7) {
            modAccuracyRightHand = -0.5;
            // console.log(this.accuracy)
        }
        if (this.dmgTaken[3] == 0) {
            modAccuracyLeftHand = 0;
            // console.log(this.accuracy);
        } else if (this.dmgTaken[3] >= 4 && this.dmgTaken[3] <= 6) {
            modAccuracyLeftHand = -0.25;
            // console.log(this.accuracy);
        } else if (this.dmgTaken[3] >= 7) {
            modAccuracyLeftHand = -0.5;
            // console.log(this.accuracy);
        }
    
        let modAccuracy = modAccuracyHead + modAccuracyRightHand + modAccuracyLeftHand;
        // чтобы переменная в объекте изменялась, возможно будут и другие источники изменения модифицированной точности(перки, дебаффы)
        this.modAccuracy = modAccuracy + modifier;
        // считаем модифицированную точность и складываем её с начальной точнотсью персонажа, тем самым пересчитыая фактическую точность
        this.accuracy = this.defaultAccuracy + this.modAccuracy;
        // на defaultAccuracy в свою очередь будут влиять перки и другие постоянные модификаторы
    };

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
    
  

    // текущие очки ходов
    this.move = 4;
    // кол-во ходов по карте. отнимается за передвижение и действия, когда равно нулю - пояляется кнопка ЗАКОНЧИТЬ ХОД(ф-ия передачи хода другому игроку)
    this.escape = 2;
    // величина, влияющая на шанс сбежать из боя, реализуется расчетом runawayRoll() при нажатии на кнопку "выход из боя"
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
    this.modifiedHealth = 0;
    this.startingHealth = 30;
    this.maxHealth = this.startingHealth + this.modifiedHealth;
    this.currentHealth = this.maxHealth;
    // this.currentHealth = this.maxHealth + this.modifiedHealth;
    // УЧЕСТЬ УВЕЛИЧИВАЕМОЕ ЗДОРОВЬЕ от первков и лвлАПА
    this.changeHealth = function(modifier) {
        let modHealth = 0;
        // проверка повреждений торса
        // раны влияют на максимальное здоровье персонажа
        // нанесение урона в средне-тяжелораненом состоянии дополнительно снижает здоровье на 1 
        if (this.dmgTaken[2] == 0) {
            modHealth = 0;
            this.checkCondition(0);
            console.log(this.currentHealth);
            console.log(this.maxHealth);
        } else if (this.dmgTaken[2] >= 4 && this.dmgTaken[2] <= 6) {
            modHealth = -2.5;
            this.checkCondition(-1);
            console.log(this.currentHealth);
            console.log(this.maxHealth);
        } else if (this.dmgTaken[2] >= 7) {
            modHealth = -5;
            this.checkCondition(-1);
            console.log(this.currentHealth);
            console.log(this.maxHealth);
        }
        this.modifiedHealth = modHealth + modifier;
        this.maxHealth = this.startingHealth + this.modifiedHealth;
        // this.maxHealth += this.modifiedHealth;
        // this.currentHealth = this.maxHealth + this.modifiedHealth;
    };

    this.isAlive = true;
    this.dmgTaken = [0,0,0,0,0,0];
    // this.dmgTaken = {
    //     head : 0,
    //     rightHand : 0,
    //     torso : 0,
    //     leftHand : 0,
    //     rightLeg : 0,
    //     leftLeg : 0,
    // };

    // + снижать this.move -= 1 за тяжелые ранения ног и шанс сбежать из боя в runawayRoll()
    //  цикл с условиями (МБ ТУТ ПРЕВРАЩАТЬ ОБЪЕКТ В МАССИВ а возвращать значения объекта?)
    // ХОТЯ всё равно надо бдует манипулировать классами разных частей тела разных оппонентов, пока сойдет повторяющийся код
    
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
            // this.currentHealth = this.maxHealth + this.modifiedHealth;
        };
        if ( this.currentHealth <= 0 ) {
            this.isAlive = false;
        };
        if ( this.currentHealth > 0 ) {
            this.isAlive = true;
        };
        if ( this.heavyWounds >= 3 ) {
            this.isAlive = false;
        };
        if ( this.deadlyWounds >= 1 ) {
            this.isAlive = false;
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
        // влияние на максимальное здоровье персонажа
        if ( this.expirience <= 19 ) {
            this.rank = 1;
            this.displayedRank = "Rookie"
            this.startingHealth = 30;
        } else if ( this.expirience >= 20 && this.expirience <= 49 ) {
            this.rank = 2;
            this.displayedRank = "Skilled";
            this.startingHealth = 35;
        } else if ( this.expirience >= 50 && this.expirience <= 99 ) {
            this.rank = 3;
            this.displayedRank = "Veteran";
            this.startingHealth = 40;
        } else {
            this.rank = 4;
            this.displayedRank = "Master";
            this.startingHealth = 45;
        }   
    };
};

// КОНСТРУКТОР ОРУЖИЯ
function Makarov ( name ) {
    this.name = name;
    this.type = "pistol";
    this.capacity = 3;
    // this.weaponCapacity = 3;
    // должно заполнять количество слотов в массиве(или просто в переменной считается) weaponCapacity в объекте игрока
    this.oneHanded = true;
    this.isJammed = false;
    this.jammingChance = 0;
    this.size = 1;
    // количество слотов в массиве предметов Inventory
    this.availability = 1;
    this.availabilityDisplay = "for Rookie";
    this.damage = 2;
    this.accuracy = -1;
    
};

function UZI ( name ) {
    this.name = name;
    this.type = "smg";
    this.capacity = 3;
    this.oneHanded = true;
    this.isJammed = false;
    this.jammingChance = 0;
    this.size = 1;
    this.availability = 1;
    this.availabilityDisplay = "for Rookie";
    this.damage = 2;
    this.accuracy = -1;
    
};

function Shortbarrel ( name ) {
    this.name = name;
    this.type = "shotgun";
    this.capacity = 4;
    this.oneHanded = false;
    this.isJammed = false;
    this.jammingChance = 0;
    this.size = 1;
    this.availability = 1;
    this.availabilityDisplay = "for Rookie";
    this.damage = 3;
    this.accuracy = -3;
    // this.accuracy = -2;
    // -3 accuracy against humanoids; -2 accuracy against monsters
};

function Remington870 ( name ) {
    this.name = name;
    this.type = "shotgun";
    this.capacity = 4;
    this.oneHanded = false;
    this.isJammed = false;
    this.size = 1;
    this.availability = 1;
    this.availabilityDisplay = "for Rookie";
    this.damage = 3;
    this.accuracy = -2;
    this.jamming = 0;
    // -3 accuracy against humanoids
    // -2 accuracy against monsters
};


// КОНСТРУКТОР БРОНИ
function Armor ( name ) {
    this.name = name;
    // this.availability = 1;
    // this.availabilityDisplay = "for Rookie";
    this.defence = 1;
    // для разных частей тела физ защиту реализовать прямо тут?
    this.chemDefence = 1;
}

function Inventory ( item ) {
    this.items = {};
    this.items = [];
    // this.items = new Array(10); - создает массив с заданной длиной 10; (как её сохранить? иметь эталонную длину в переменной,
    // а длина массива не должна быть больше чем это число, сравинваем при операциях с инвентарем)
    // тут методы itemRemove() и itemAdd()) должны пихать и доставать из массива(объекта) размером 9 итемы
    // делать проверку if items length >= 10 мы блокируем добавление нвых итемов?
}
//FIXME: ИЛИ
// this.inventory = [] - массив\объект с items внутри
// 2 метода - this.itemAdd() и this.itemRemove(), работающие с этим массивом\объектом

// Урон = урон оружия +-модификаторы + dmgRoll( )
// Точность(выбор КУДА стрелять) = точность оружия +-модификаторы + accRoll( )
// шанс заклинивания = стандартный шанс заклинивания +- шанс заклинивания используемого оружия(если есть) +-модификаторы