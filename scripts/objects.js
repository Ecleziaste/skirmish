// class Humanoid {
//     constructor(name) {
//         this.name = name;
//         this.health = 20;
//         this.isAlive = true;
//         this.rank = "rookie";
//     }
// };

//TODO: получить доступ к разным частям тела и их состоянию ранинрования
// должно быть максимальное количество HP

function Humanoid ( name ) {
    this.name = name;

    this.totalHealth = 20;
    this.isAlive = true;
    this.checkCondition = function ( hp ) {
        this.totalHealth += hp;
        if ( this.totalHealth > 20 ) {
            this.totalHealth = 20;
            return this.totalHealth;
        }
        if ( this.totalHealth === 0 ) {
            this.isAlive = false;
            return this.isAlive;
        }
        
    };

    this.heavyWounds = 0;
    

    this.expirience = 0;
    this.rank = "rookie";
    this.checkRank = function ( xp ){
        this.expirience += xp;
        if ( this.expirience <= 19 ) {
            this.rank = "rookie";
            return this.rank;
        } else if ( this.expirience >= 20 && this.expirience <= 49 ) {
            this.rank = "skilled";
            return this.rank;
        } else if ( this.expirience >= 50 && this.expirience <= 99 ) {
            this.rank = "veteran";
            return this.rank;
        } else {
            this.rank = "master";
            return this.rank;
        }
        
    };
  
};

let leftPlayer = new Humanoid("Soldier");
let rightPlayer = new Humanoid("Bandit");

function Weapon ( name ) {
    this.name = name;
    this.availability = "rookie";
    this.damage = 3;
    this.accuracy = 0;
    this.jamming = 0;

}

function Armor ( name ) {
    this.name = name;
    this.armor = 2;
    // для разных частей тела физ защиту реализовать
    this.chemArmor = 1;
}

// Урон = урон оружия +-модификаторы + dmgRoll( )
// Точность(выбор КУДА стрелять) = точность оружия +-модификаторы + accRoll( )
// шанс заклинивания = стандартный шанс заклинивания +- шанс заклинивания используемого оружия(если есть) +-модификторы