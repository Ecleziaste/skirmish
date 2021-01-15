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
let target = document.querySelectorAll( '.bodyparts' );
let targets = Array.from( target );
// let targets = new Array( document.querySelectorAll( 'bodyparts' ) );

// КОНСТРУКТОР ЧЕЛОВЕКООБРАЗНЫХ ПЕРСОНАЖЕЙ
function Humanoid ( name ) {
    this.name = name;
    this.move = 4;
       // кол-во ходов по карте. отнимается за передвижение и действия
    this.weaponCapacity = 0;
    this.currentWeapon = 
    // weaponCapacity = max 10 . орпделеяет сколько пушек можно быстро менять в бою вместо выстрела
    // малогабаритное занимает 3 очка, среднее 4 очка, крупное 6(7) очков
    // 3 малогабаритных вида оружия,
    // 2 малогабаритных вида оружия и 1 среднегабаритное, 
    // 2 среднегабаритных, 
    // 1 малогабаритное и 1 крупногабаритное.
    // метод стрельбы. берет урон из current weapon + модификаторы и отнибает из него бронь,
    //  полученное значение: прибавляется в часть тела куда стреляли; отнимает здоровье из currentHealth

    this.maxHealth = 30;
    this.currentHealth = 30;
    this.isAlive = true;
    this.heavyWounds = 0;
    this.checkCondition = function ( hp ) {
        this.currentlHealth += hp;
        if ( this.currentHealth > 30 ) {
            this.currentHealth = maxHealth;
            return this.currentHealth;
        }
        if ( this.currentHealth === 0 ) {
            this.isAlive = false;
            return this.isAlive;
        }
        if ( this.heavyWounds = 3 ) {
            this.isAlive = false;
            return this.isAlive;
        }
        
    };

    
    
    
    // TODO: функция rankUp() когда ранг повышается this.totalHealth += 5; максимальное здоровье повышается на 5 (и восстанавливается здоровье до текущей величины)
    this.expirience = 0;
    this.rank = "rookie";
    this.checkRank = function ( xp ){
        this.expirience += xp;
        if ( this.expirience <= 19 ) {
            // this.totalHealth = 30;
            this.rank = "rookie";
            return this.rank;
        } else if ( this.expirience >= 20 && this.expirience <= 49 ) {
            this.rank = "skilled";
            // this.totalHealth = 35;
            return this.rank;
        } else if ( this.expirience >= 50 && this.expirience <= 99 ) {
            this.rank = "veteran";
            // this.totalHealth = 40;
            return this.rank;
        } else {
            this.rank = "master";
            return this.rank;
        }
        
    };
  
};

let leftPlayer = new Humanoid("Soldier");
let rightPlayer = new Humanoid("Bandit");

// СЧЕТЧИК РАН НА ЗАМЫКАНИИ ЫЫЫЫЫЫЫЫЫЫЫЫЫЫ БЛЯ


// КОНСТРУКТОР ОРУЖИЯ
function Weapon ( name ) {
    this.name = name;
    this.capacity = 3;
    // должно заполнять количество слотов в массиве weaponCapacity в объекте игрока
    // oneHanded
    this.size = 1;
    // количество слотов в массиве предметов Inventory
    this.availability = "rookie";
    this.damage = 3;
    this.accuracy = 0;
    this.jamming = 0;

}

let startingWeapon = new Weapon ("Pistol");





function Armor ( name ) {
    this.name = name;
    this.armor = 2;
    // для разных частей тела физ защиту реализовать
    this.chemArmor = 1;
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