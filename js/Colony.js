// Симулятор колонии муравьев

class Colony {
    // Палитра по умолчанию
    pallet=[
        'SaddleBrown',
        'OrangeRed',
        'Olive',
        'Maroon'
    ];

    constructor(i, pos, food) {
        this.weight=food;
        this.pos=pos;
        this.color=this.getColor(i);
        this.ai=new PI();
        this.listAnt=[];
        this.loss=0;
        this.frag=0;
        this.delay=200;
        this.timer=this.delay/4;
    }

    // Обновление
    update() {
        if (this.weight>100)
            this.timer--;
            if (this.timer<0) {
                this.listAnt.push(new Ant(this));
                this.weight-=100;
                this.timer=this.delay;
            }
        let listAnt=[];
        let frag=0;
        for (let ant of this.listAnt) {
            if (ant.timer<(ant.delay*-10)) {
                model.newFood(model.randPos(ant.pos, 4), 100);
                this.loss++;
            } else {
                listAnt.push(ant);
                ant.update();
            }
            frag+=ant.frag;
        }
        this.listAnt=listAnt;
        this.frag=frag;
        model.map[this.pos.x][this.pos.y]=this; //Аварийное обновление на карте
    }

    // Отрисовка
    draw(ctx) {
        let grad=ctx.createRadialGradient(this.pos.x, this.pos.y, 8, this.pos.x, this.pos.y, 32);
        grad.addColorStop(0, this.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle=grad;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 32, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        // Информация
        if (control.info) {
            ctx.font="8pt Arial";
            ctx.fillStyle='White';
            ctx.fillText(this.listAnt.length, this.pos.x, this.pos.y-4);
            ctx.font="6pt Arial";
            ctx.fillStyle='Red';
            ctx.fillText(this.frag, this.pos.x-8, this.pos.y+6);
            ctx.fillStyle='Black';
            ctx.fillText(this.loss, this.pos.x+8, this.pos.y+6);
        }
    }
    
    // Цвет колонии
    getColor(i) {
        let color;
        if (i<this.pallet.length)
            color=this.pallet[i];
        else
            color='#'+Math.floor(Math.random()*16777216).toString(16).padStart(6, '0');
        return color;
    }
}