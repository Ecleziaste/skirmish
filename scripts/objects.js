'use strict';

// КОНСТРУКТОР ЧЕЛОВЕКООБРАЗНЫХ ПЕРСОНАЖЕЙ
class Humanoid {
    constructor( name, weapon, armor, items, weaponToEquip, itemToEquip, itemToInventory, perks ) {
        this.name = name;
        this.armor = armor;
        this.currentWeapon = weapon;
        //    <<<<<<<<<<<< ТОЧНОСТЬ >>>>>>>>>>>>
        // начальная точность персонажа, относительно постоянная величина 
        this.defaultAccuracy = 1;
        // эта величина накапливает постоянные плюсы-минусы к точности
        this.accPermaModifier = 0;
        // модифицировання точность от ран или в ходе боя, временные модификаторы боя плюсуются сюда же
        this.modifiedAccuracy = 0;
        // фактическая точность
        this.accuracy = this.defaultAccuracy + this.accPermaModifier + this.modifiedAccuracy;
        //    <<<<<<<<<<<< ПЕРЕДВИЖЕНИЕ >>>>>>>>>>>>
        // величина, влияющая на шанс сбежать из боя, реализуется расчетом runawayRoll() or escapeRoll() при нажатии на кнопку "выход из боя"
        this.escape = this.movePoints / 2;
        this.defaultMobility = 4;
        this.mobilityPermaModifier = 0;
        this.modifiedMobility = 0;
        // текущие очки ходов. отнимается за передвижение и действия, когда равно нулю - пояляется кнопка ЗАКОНЧИТЬ ХОД(ф-ия передачи хода другому игроку)
        this.movePoints = this.defaultMobility + this.mobilityPermaModifier + this.modifiedMobility;
        // //    <<<<<<<<<<<< ЭКИПИРОВАННОЕ ОРУЖИЕ >>>>>>>>>>>>
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
        //    <<<<<<<<<<<< ЗДОРОВЬЕ >>>>>>>>>>>>
        this.defaultHealth = 30;
        this.healthPermaModifier = 0;
        this.modifiedHealth = 0;
        this.maxHealth = this.defaultHealth + this.healthPermaModifier + this.modifiedHealth;
        this.currentHealth = this.maxHealth;
        // УЧЕСТЬ УВЕЛИЧИВАЕМОЕ ЗДОРОВЬЕ от первков и лвлАПА
        this.isAlive = true;
        this.dmgTaken = [0, 0, 0, 0, 0, 0];
        // состояние частей тела(дамаг в них и есть ли тяжелая рана)
        this.hvyWnd = [false, false, false, false, false, false];
        // this.hvyWnd = { head : false, rightHand : false, torso : false, leftHand : false, rightLeg : false, leftLeg : false,};
        this.heavyWounds = 0;
        this.deadlyWounds = 0;
        //    <<<<<<<<<<<< ОПЫТ >>>>>>>>>>>>
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
        // TODO:  Добавить плюсики к move и асс возможно, + увеличение носимого инвентярая на 1? всё может улучшаться перками,
        //  которые будут лежать в объекте и влиять на характеристики. если есть сервак, где хранится состояние объекта, можно использовать
        // лежащие внутри перки только для отображения иконок и общих статов персонажа - в списке эффектов, на него наложенных
    }
    
    // вызывать каждый раз, когд что-то влияет на точность?
    changeAccuracy = function (modifier) {
        // modifier для красткосрочных событий в бою
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
        } else if (this.dmgTaken[1] >= 4 && this.dmgTaken[1] <= 6) {
            modAccuracyRightHand = -0.25;
        } else if (this.dmgTaken[1] >= 7) {
            modAccuracyRightHand = -0.5;
        }

        if (this.dmgTaken[3] == 0) {
            modAccuracyLeftHand = 0;
        } else if (this.dmgTaken[3] >= 4 && this.dmgTaken[3] <= 6) {
            modAccuracyLeftHand = -0.25;
        } else if (this.dmgTaken[3] >= 7) {
            modAccuracyLeftHand = -0.5;
        }

        let modAccuracy = modAccuracyHead + modAccuracyRightHand + modAccuracyLeftHand;
        // чтобы переменная в объекте изменялась, возможно будут и другие источники изменения модифицированной точности(перки, дебаффы)
        this.modifiedAccuracy = modAccuracy + modifier;
        // считаем модифицированную точность и складываем её с начальной точнотсью персонажа, тем самым пересчитыая фактическую точность
        this.accuracy = this.defaultAccuracy + this.accPermaModifier + this.modifiedAccuracy;
        // на defaultAccuracy в свою очередь будут влиять перки и другие постоянные модификаторы
    };

    changeMobility = function (modifier) {
        // modifier для красткосрочных событий в бою
        let modMobilityRightLeg = 0;
        let modMobilityLeftLeg = 0;
        // проверка повреждений головы 
        if (this.dmgTaken[4] == 0) {
            modMobilityRightLeg = 0;
        } else if (this.dmgTaken[4] >= 4 && this.dmgTaken[4] <= 6) {
            modMobilityRightLeg = -0.5;
        } else if (this.dmgTaken[4] >= 7) {
            modMobilityRightLeg = -1;
        }
        // повреждения правой и левой рук
        if (this.dmgTaken[5] == 0) {
            modMobilityLeftLeg = 0;
        } else if (this.dmgTaken[5] >= 4 && this.dmgTaken[5] <= 6) {
            modMobilityLeftLeg = -0.5;
        } else if (this.dmgTaken[5] >= 7) {
            modMobilityLeftLeg = -1;
        }

        let modMobility = modMobilityRightLeg + modMobilityLeftLeg;
        this.modifiedMobility = modMobility + modifier;
        this.movePoints = this.defaultMobility + this.mobilityPermaModifier + this.modifiedMobility;
    };

    changeHealth = function (modifier) {
        let modHealth = 0;
        // влияние на максимальное здоровье
        if (this.dmgTaken[2] == 0) {
            modHealth = 0;
        } else if (this.dmgTaken[2] >= 4 && this.dmgTaken[2] <= 6) {
            modHealth = -2.5;
        } else if (this.dmgTaken[2] >= 7) {
            modHealth = -5;
        }
        this.modifiedHealth = modHealth + modifier;
        this.maxHealth = this.defaultHealth + this.healthPermaModifier + this.modifiedHealth;
    };
    // ф-ия начисления опыта и лвлапа
    checkRank = function (xp) {
        this.expirience += xp;
        //  можно восстанавливать здоровье до максимальной величины при лвлапе(как в волшебных мирах), воздействуя на currentHealth 
        // влияние на максимальное здоровье персонажа
        if (this.expirience <= 19) {
            this.rank = 1;
            this.displayedRank = "Rookie";
            this.defaultHealth = 30;
        } else if (this.expirience >= 20 && this.expirience <= 49) {
            this.rank = 2;
            this.displayedRank = "Skilled";
            this.defaultHealth = 35;
        } else if (this.expirience >= 50 && this.expirience <= 99) {
            this.rank = 3;
            this.displayedRank = "Veteran";
            this.defaultHealth = 40;
        } else {
            this.rank = 4;
            this.displayedRank = "Master";
            this.defaultHealth = 45;
        }
    };
    // запускать перед выстрелом, чтобы сработал дополнительный дамаг от попаданий в уже тяжелую рану
    hvyWndCheck = function () {
        for (let i = 0; i < this.dmgTaken.length; i++) {
            (this.dmgTaken[i] >= 7) ? this.hvyWnd[i] = true : this.hvyWnd[i] = false;
        }
    };
    // ф-ия дополнительного урона в зависимости от условий(тяжелые раны, облучение, другие дебаффы), запускать после расчета урона от выстрела
    additionalDmg = function (bodypart) {
        if (this.hvyWnd[bodypart] == true) {
            this.dmgTaken[bodypart] += 3;
            this.checkCondition(-3);
        }
    };
    // проверка состояния здоровья игрока после событий
    checkCondition = function (hp) {
        this.currentHealth += hp;
        let heavyWoundsCount = 0;
        // создаем счетчик тяжелых ран, ищем их и отправляем данные в характеристики объекта
        for (let i = 0; i <= 5; i++) {
            if (this.dmgTaken[i] >= 7) {
                heavyWoundsCount++;
            }
        };
        this.heavyWounds = heavyWoundsCount;

        if (this.currentHealth > this.maxHealth) {
            this.currentHealth = this.maxHealth;
        };
        if (this.currentHealth <= 0) {
            // if (this.currentHealth <= -5) {тут вызываем ф-ию с анимацией обильного кровотечения};
            this.isAlive = false;
        };
        if (this.currentHealth > 0) {
            this.isAlive = true;
        };
        if (this.heavyWounds >= 3) {
            this.isAlive = false;
        };
        // проверка на наличие смертельной раны
        for (let i = 0; i <= 5; i++) {
            if (this.dmgTaken[i] >= 20) {
                this.deadlyWounds = 1;
            }
        };
        if (this.deadlyWounds >= 1) {
            // тут запускаем ф-ию с отрыванием части тела
            this.isAlive = false;
        };
    };

    checkWoundsCondition = function  ( i , j ) {
        if (this.dmgTaken[i] <= 0) {
            targets[j].classList.remove('low_wound','medium_wound', 'heavy_wound');
        }
        if (this.dmgTaken[i] >= 1 && this.dmgTaken[i] <= 3) {
            targets[j].classList.add('low_wound');
            targets[j].classList.remove('medium_wound', 'heavy_wound');
        }
        if (this.dmgTaken[i] >= 4 && this.dmgTaken[i] <= 6) {
            targets[j].classList.add('medium_wound');
            targets[j].classList.remove('low_wound', 'heavy_wound');
        }
        if (this.dmgTaken[i] >= 7) {
            targets[j].classList.add('heavy_wound');
            targets[j].classList.remove('low_wound', 'medium_wound');
            // FIXME:  this.heavyWounds += 1; This is Brutal mode - смерть при двух попаданиях в тяжелую рану  !!  следует вынести в ф-ию
            // Мб переделать всё же отрисовку ран для каждого игрока(разделить массив targets на 2 разных массива и брать оттуда инфу)
            checkVictory(); 
            // проверяем на победу, ибо 3 тяжелые раны приравниваются к смерти
        }
    }
}

// КЛАСС ОРУЖИЯ
class Weapon {
    constructor( name, type, oneHanded, damage, accuracy, capacity, jammingChance, size, availability ) {
        this.name = name;
        this.type = type;
        this.oneHanded = oneHanded;
        this.damage = damage;
        this.accuracy = accuracy;
        this.capacity = capacity;
        // this.weaponCapacity = 3;
        // должно заполнять количество слотов в массиве(или просто в переменной считается) weaponCapacity в объекте игрока
        this.isJammed = false;
        this.jammingChance = jammingChance;
        this.size = size;
        // количество слотов в массиве предметов Inventory
        this.availability = availability;
    }
    set availabilityDisplay(value) {
        value = this.availability; 
        if ( value = 1 ) {return this.availabilityDisplay = "for Rookie";}
        if ( value = 2 ) {return this.availabilityDisplay = "for Skilled";}
        if ( value = 3 ) {return this.availabilityDisplay = "for Veteran";} 
        if ( value = 4 ) {return this.availabilityDisplay = "for Master";}   
    }
}

// КОНСТРУКТОР БРОНИ
class Armor {
    constructor( name, defence, bulletDefArr, chem, rad, fire, avail ) {
        this.name = name;
        this.defence = defence;
        this.bulletDef = bulletDefArr;
        // остальные типы защиты
        this.chemDef = chem;
        this.radDef = rad;
        this.fireDef = fire;

        this.availability = avail;
    }
    // FIXME: наследовать от Weapon?
    set availabilityDisplay(value) {
        value = this.availability; 
        if ( value = 1 ) {return this.availabilityDisplay = "for Rookie";}
        if ( value = 2 ) {return this.availabilityDisplay = "for Skilled";}
        if ( value = 3 ) {return this.availabilityDisplay = "for Veteran";} 
        if ( value = 4 ) {return this.availabilityDisplay = "for Master";}   
    }
}

function Inventory ( item ) {
    this.items = {};
    this.items = [];
    // this.items = new Array(10); - создает массив с заданной длиной 10; (как её сохранить? иметь эталонную длину в переменной,
    // а длина массива не должна быть больше чем это число, сравинваем при операциях с инвентарем)
    // тут методы itemRemove() и itemAdd() должны пихать и доставать из массива(объекта) размером 10 итемы
    // делать проверку if items length >= 10 мы блокируем добавление нвых итемов?
    // похоже, придется пересоздавать массив с предеметами до нужной длины или удалять всё, что выше НУЖНОЙ длины, и возвращать обратно
}
//FIXME: ИЛИ
// this.inventory = [] - массив\объект с items внутри
// 2 метода - this.itemAdd() и this.itemRemove(), работающие с этим массивом\объектом

// Урон = урон оружия +-модификаторы + dmgRoll( )
// Точность(выбор КУДА стрелять) = точность оружия +-модификаторы + accRoll( )
// шанс заклинивания = стандартный шанс заклинивания +- шанс заклинивания используемого оружия(если есть) +-модификаторы