//Симулятор колонии муравьев

class Items {
    //Абстрактный класс для объектов
    constructor(pos) {
        this.pos={
            x: pos.x,
            y: pos.y
        };
    }

    draw(ctx) {
        ctx.fillStyle=this.color;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 2, 0, Flyweight.Pi2);
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
        this.weight=1; //Math.round(Math.random()*16)+240;
    }
}

class Food extends Items {
    static color='Brown';
    //Корм - непроходим, переносим и съедобен
    constructor(pos, weight) {
        super(pos);
        this.color=Food.color;
        this.weight=weight;
    }

    draw(ctx) {
        super.draw(ctx);
        //Информация
        if (control.info) {
            ctx.fillStyle='black';
            ctx.font="6pt Arial";
            ctx.fillText(this.weight, this.pos.x, this.pos.y-5);
        }
    }
}

class Label {
    //Метки - запах корма и муравьев
    constructor(color, pos) {
        this.pos={
            x: pos.x,
            y: pos.y
        };
        this.color=color;
        this.weight=1024;
    }

    update() {
        this.weight--;
    }

    draw(ctx) {
        ctx.fillStyle=this.color;
        ctx.beginPath();
        ctx.fillRect(this.pos.x, this.pos.y, 1, 1);
        ctx.fill();
        ctx.closePath();
    }
}