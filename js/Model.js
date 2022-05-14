//Симулятор колонии муравьев

class Model {
    //Базовая модель
    constructor() {
        this.size={
            width: window.innerWidth,
            height: window.innerHeight
        };
        this.base=4;
        this.food=256;
        this.map=[];
        this.air=[];
        this.listBlock=[];
        this.listColony=[];
        this.listRock=[];
        this.listFood=[];
        this.listLabel=[];
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
            let colony=new Colony(i, this.rndPos(), this.food);
            this.listColony.push(colony);
            this.map[colony.pos.x][colony.pos.y]=colony;
        }
        //Камни
        for (let i=0; i<this.base*10; i++) {
            let rock=new Rock(this.rndPos());
            this.listRock.push(rock);
            this.map[rock.pos.x][rock.pos.y]=rock;
        }
        //Корм
        for (let i=0; i<this.base*20; i++)
            this.newFood(this.rndPos());
    }

    //Обновление
    update() {
        for (let colony of this.listColony)
            colony.update();
        //Испарение меток
        let listLabel=[];
        for (let label of this.listLabel) {
            label.update();
            if (label.weight>0)
                listLabel.push(label);
            else {
                delete this.air[label.pos.x][label.pos.y];
                this.air[label.pos.x][label.pos.y]=false;
            }
        }
        this.listLabel=listLabel;
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
    newFood(pos, weight=Math.round(Math.random()*128)+128) {
        let food=new Food(pos, weight);
        this.listFood.push(food);
        this.map[food.pos.x][food.pos.y]=food;
    }

    //Удаление корма
    delFood() {
        let listFood=[];
        for (let food of this.listFood) {
            if (food.weight>0)
                listFood.push(food);
            else {
                delete this.map[food.pos.x][food.pos.y];
                this.map[food.pos.x][food.pos.y]=false;
            }
        }
        this.listFood=listFood;
    }
    
    //Добавление метки
    newLabel(color, pos) {
        if (!this.air[pos.x][pos.y]) {
            let label=new Label(color, pos);
            this.air[pos.x][pos.y]=label;
            this.listLabel.push(label);
        } else if (this.air[pos.x][pos.y].color!=color && this.air[pos.x][pos.y].weight<1024) {
            this.air[pos.x][pos.y].color=color;
            this.air[pos.x][pos.y].weight=1024;
        } else if (this.air[pos.x][pos.y].color==color)
            this.air[pos.x][pos.y].weight=Math.min(this.air[pos.x][pos.y].weight+1024, 8192);
        else
            this.air[pos.x][pos.y].weight--;
    }

    //Обзор юнита
    vision(ant) {
        if (ant.target instanceof Ant) //атака или запрос знаний
            return ant.target;
        for (let i=1; i<=ant.range; i++) {
            let sector=this.getSector(ant.pos, i);
            for (let j=sector.left; j<=sector.right; j++) {
                if (this.map[j][sector.top] instanceof ant.goal)
                    return this.map[j][sector.top];
                if (this.map[j][sector.bottom] instanceof ant.goal)
                    return this.map[j][sector.bottom];
            };
            for (let j=sector.top+1; j<=sector.bottom-1; j++) {
                if (this.map[sector.left][j] instanceof ant.goal)
                    return this.map[sector.left][j];
                if (this.map[sector.right][j] instanceof ant.goal)
                    return this.map[sector.right][j];
            };
        };
        return {pos: this.rndPos(ant.pos, ant.range)};
    }

    //Случайная позиция
    rndPos(pos={x: this.size.width/2, y: this.size.height/2}, range=false) {
        let sector=this.getSector(pos, range);
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

    //Границы сектора
    getSector(pos, range=false) {
        if (range)
            return {
                left: Math.max(pos.x-range, 0),
                right: Math.min(pos.x+range, this.size.width-1),
                top: Math.max(pos.y-range, 0),
                bottom: Math.min(pos.y+range, this.size.height-1)
            };
        else
            return {
                left: this.size.width*0.05,
                right: this.size.width*0.95,
                top: this.size.height*0.05,
                bottom: this.size.height*0.95
            };
    }

    //Расстояние до цели
    delta(pos, target) {
        return Math.sqrt(Math.pow(target.pos.x-pos.x, 2)+Math.pow(target.pos.y-pos.y, 2));
    }
    /*
    //Сохранение игры (ДОРАБОТАТЬ)
    save() {
        var blob=new Blob(["Тестовый текст ..."],
            {type: "text/plain; charset=utf-8"});
        saveAs(blob, "save_"+new Date().toJSON().slice(0,10)+".txt");
    }

    //Загрузка игры (ДОРАБОТАТЬ)
    load() {
        ;
    }
    */
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
