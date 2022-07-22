// Симулятор колонии муравьев

class Model {
    //Базовая модель
    constructor() {
        this.size={
            width: window.innerWidth,
            height: window.innerHeight
        };
        this.base=BASE;
        this.food=399;
        this.map=[];
        this.air=[];
        this.listBlock=[];
        this.listColony=[];
        this.listRock=[];
        this.listFood=[];
        this.listLabel=[];
        this.init();
    }

    // Инициализация карты
    init() {
        // Карты
        for (let x=0; x<this.size.width; x++) {
            this.map[x]=[];
            this.air[x]=[];
            for (let y=0; y<this.size.height; y++) {
                this.map[x][y]=false;
                this.air[x][y]=false;
                this.newBlock({x: x, y: y});
            }
        }
        // Колонии
        for (let i=0; i<this.base; i++) {
            let section=Math.PI*2/this.base*i-Math.PI/2+Math.PI/this.base*((this.base+1)%2);
            let radius=Math.min(this.size.width, this.size.height);
            radius=(radius-radius/this.base)/2;
            let pos={
                x: this.size.width/2+radius*Math.cos(section), 
                y: this.size.height/2+radius*Math.sin(section)
            };
            pos=this.roundPos(pos);
            let colony=new Colony(i, this.randPos(pos), this.food);
            this.listColony.push(colony);
            this.map[colony.pos.x][colony.pos.y]=colony;
        }
        // Камни
        for (let i=0; i<this.base*25; i++)
            this.newRock(this.randPos());
        // Корм
        for (let i=0; i<this.base*100; i++)
            if (false && i%2>0) ////////////////////////////////////////////////
                this.newFood(this.randPos());
            else
                this.newFood(this.randPos({x: this.size.width/2, y: this.size.height/2}, 100));
    }

    // Обновление
    update() {
        for (let colony of this.listColony)
            if (colony.weight && colony.weight<100 && colony.listAnt.length<1) {
                colony.color='#00000060';
                this.newFood(this.randPos(colony.pos, 4), colony.weight);
                colony.weight=false;
            } else
                colony.update();
        // Испарение меток
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

    // Добавление блоков
    newBlock(pos) {
        let border=1;
        if ((pos.x<border || pos.x>=(this.size.width-border)) ||
            (pos.y<border || pos.y>=(this.size.height-border))) {
            let block=new Block({x: pos.x, y: pos.y});
            this.listBlock.push(block);
            this.map[pos.x][pos.y]=block;
        }
    }

    // Добавление камня
    newRock(pos) {
        let rock=new Rock(pos);
        this.listRock.push(rock);
        this.map[rock.pos.x][rock.pos.y]=rock;
    }

    // Добавление корма
    newFood(pos, weight=Math.round(Math.random()*128)+128) {
        let food=new Food(pos, weight);
        this.listFood.push(food);
        this.map[food.pos.x][food.pos.y]=food;
    }

    // Удаление корма
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
    
    // Добавление метки
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

    // Случайная позиция
    randPos(pos={x: this.size.width/2, y: this.size.height/2}, range=Math.max(this.size.width, this.size.height)) {
        let sector=this.getSector(pos, range);
        while (this.map[pos.x][pos.y]!==false) {
            pos={
                x: Math.random()*(sector.right-sector.left)+sector.left,
                y: Math.random()*(sector.bottom-sector.top)+sector.top
            };
            pos=this.roundPos(pos);
        }
        return pos;
    }

    // Границы сектора
    getSector(pos, range) {
        return {
            left: Math.max(pos.x-range, 0),
            right: Math.min(pos.x+range, this.size.width-1),
            top: Math.max(pos.y-range, 0),
            bottom: Math.min(pos.y+range, this.size.height-1)
        };
    }

    // Округление координат позиции
    roundPos(pos) {
        return {x: Math.round(pos.x), y: Math.round(pos.y)};
    }

    // Расстояние до цели
    delta(pos, target) {
        return Math.sqrt(Math.pow(target.pos.x-pos.x, 2)+Math.pow(target.pos.y-pos.y, 2));
    }
}

/*

ПРОВЕРКА ТОЧКИ НА ВХОЖДЕНИЕ В КАНВАС
if (ctx.isPointInPath(20,50)) {
    ctx.stroke();
};

ТЗ детям:
- Действие Сброс.
- Действие Атака.
- Случайный диапазон таймера.
- AI ...
*/