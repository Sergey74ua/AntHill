//Симулятор колонии муравьев

class Model {
    //Базовая модель
    constructor() {
        this.base=4;
        this.food=256;
        this.size={
            width: window.innerWidth,
            height: window.innerHeight
        };
        this.map=[];
        this.air=[];
        this.listBlock=[];
        this.listColony=[];
        this.listRock=[];
        this.listFood=[];
        this.init();
    }

    //Инициализация карты
    init() {
        //Карта
        for (let x=0; x<this.size.width; x++) {
            this.map[x]=[];
            this.air[x]=[];
            for (let y=0; y<this.size.height; y++) {
                this.map[x][y]=false;
                this.air[x][y]=false;
                this.newBlock({x: x, y: y});
            }
        }
        //Колонии
        for (let i=0; i<this.base; i++) {
            let pos=this.rndPos();
            let colony=new Colony(i, pos, this.food);
            this.listColony.push(colony);
            this.map[pos.x][pos.y]=colony;
        }
        //Камни
        for (let i=0; i<this.base*10; i++) {
            let pos=this.rndPos();
            this.newRock(pos);
        }
        //Корм
        for (let i=0; i<this.base*20; i++) {
            let pos=this.rndPos();
            this.newFood(pos);
        }
    }

    //Обновление
    update() {
        for (let colony of this.listColony) {
            for (let ant of colony.listAnt)
                ant.update();
            colony.update();
        }
    }

    //Добавление блоков
    newBlock(pos) {
        let border=1;
        if ((pos.x<border || pos.x>=(this.size.width-border)) ||
            (pos.y<border || pos.y>=(this.size.height-border))) {
            let block=new Block({x: pos.x, y: pos.y});
            this.listBlock.push(block);
            this.map[pos.x][pos.y]=block;
        }
    }

    //Добавление корма
    newFood(pos) {
        let food=new Food(pos);
        this.listFood.push(food);
        this.map[food.pos.x][food.pos.y]=food;
    }

    //Удаление корма
    delFood(ant) {
        //console.log(this.listFood.length); /////////////////
        let listFood=[];
        for (let food of this.listFood) {
            if (food.weight>0)
                listFood.push(food);
            else {
                this.map[food.pos.x][food.pos.y]=false;
                delete ant.target; //// а что удаляет ссылка на food ?!
            }
        }
        this.listFood=listFood;
        /*this.map[ant.target.pos.x][ant.target.pos.y]=false;
        this.listFood=this.listFood.filter(function(food) {return food.weight>0});
        delete ant.target;*/
    }

    //Добавление камня
    newRock(pos) { //Отдельная функция может и не нужна.
        let rock=new Rock(pos);
        this.listRock.push(rock);
        this.map[rock.pos.x][rock.pos.y]=rock;
    }

    //Случайная позиция
    rndPos(pos={x: 0, y: 0}, range=false) {
        let sector=this.getSector(pos, range);
        if (!range)
            sector={
                left: this.size.width*.05,
                right: this.size.width*.95,
                top: this.size.height*.05,
                bottom: this.size.height*.95
            };
        //Поиск свободных координат
        let collision=true;
        while (collision) {
            pos={
                x: Math.round(Math.random()*(sector.right-sector.left)+sector.left),
                y: Math.round(Math.random()*(sector.bottom-sector.top)+sector.top)
            };
            if (this.map[pos.x][pos.y]===false)
                collision=false;
        }
        return pos;
    }
    
    //Обзор юнита (желательно, поиск по спирали, до нужной цели)
    vision(ant) {
        let sector=this.getSector(ant.pos, ant.range);
        for (let x=sector.left; x<sector.right; x++)
            for (let y=sector.top; y<sector.bottom; y++)
                if (this.map[x][y] instanceof ant.goal)
                    ant.target=this.map[x][y];
    }

    //Границы сектора
    getSector(pos, range=0) {
        return {
            left: Math.max(pos.x-range, 0),
            right: Math.min(pos.x+range, this.size.width),
            top: Math.max(pos.y-range, 0),
            bottom: Math.min(pos.y+range, this.size.height)
        };
    }

    //Расстояние до цели
    delta(pos, target) {
        return Math.sqrt(Math.pow(target.pos.x-pos.x, 2)+Math.pow(target.pos.y-pos.y, 2));
    }
    /*
    //Размер игровой карты
    resize() {
        if (this.size.width<=canvas.width)
            this.size.width=canvas.width;
        else
            this.size.width=this.size.width; //Проверка на наличие объектов
        if (this.size.height<=canvas.height)
            this.size.height=canvas.height;
        else
            this.size.height=this.size.height; //Проверка на наличие объектов
        ctx.shadowColor='Black';
        this.terrain.reload(this.size); //а что там делается?
    }

    //Сохранение игры (ДОРАБОТАТЬ)
    save() {
        var blob=new Blob(["Тестовый текст ..."],
            {type: "text/plain; charset=utf-8"});
        saveAs(blob, "save_"+new Date().toJSON().slice(0,10)+".txt");
    }

    //Загрузка игры (ДОРАБОТАТЬ)
    load() {
        ;
    }*/
}

/*
ЗАГРУЗКА
- инициализация базовых данных для рассчета
- карты:
    -- ландшафт (двумерный массив с объектами)
    -- ароматы (массив координат и вес)
        --- свой
        --- колонии
        --- общий

СТАРТ/РЕСТАРТ
- размещение колоний, корма и камней
- сохранение весов нейросети
- обнуление счетчиков

ШАГ ИГРЫ
- Обход действий муравьев
- Перерассчет ресурсов колоний
- Испарение меток
*/

/* ПРОВЕРКА ТОЧКИ НА ВХОЖДЕНИЕ В КАНВАС
if (ctx.isPointInPath(20,50)) {
    ctx.stroke();
};
*/
