//Симулятор колонии муравьев

class Items {
    //Абстрактный класс для объектов
    constructor(pos) {
        this.pos={
            x: pos.x,
            y: pos.y
        };
        this.Pi2=Math.PI*2;
    }

    draw(ctx) {
        ctx.fillStyle=this.color;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 2, 0, this.Pi2);
        ctx.fill();
        ctx.closePath();
    }
}

class Block extends Items {
    static color='#1b2b20';
    //Преграды - непроходимые, непереносимые
    constructor(pos) {
        super(pos);
        this.color=Block.color;
    }
}

class Rock extends Items {
    static color='SteelBlue';
    //Камни - непроходимые, переносимые
    constructor(pos) {
        super(pos);
        this.color=Rock.color;
        this.weight=Math.round(Math.random()*16)+240;
    }
}

class Food extends Items {
    static color='Brown';
    //Корм - непроходим, переносим и съедобен
    constructor(pos) {
        super(pos);
        this.color=Food.color;
        this.weight=Math.round(Math.random()*128)+128;
    }
}

/* /////////////////////////////////////
//Метки - запах корма и муравьев
class Label {
    constructor(aroma, weight=128) {
        this.color=aroma;
        this.weight=weight;
    }
    update() { // Учесть наложение меток
        if (this.weight>0)
            this.weight--;
        else
            delete this;
    }
}*/