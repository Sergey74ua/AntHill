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
        this.ai=new AI();
        this.listAnt=[];
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
        for (let ant of this.listAnt) {
            if (ant.timer<(-ant.delay*10))
                model.newFood(model.randPos(ant.pos, 4), 100);
            else {
                listAnt.push(ant);
                ant.update();
            }
        }
        this.listAnt=listAnt;
        //model.map[this.pos.x][this.pos.y]=this; //Аварийное обновление на карте
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
            ctx.fillStyle='White';
            ctx.font="8pt Arial";
            ctx.fillText(this.listAnt.length, this.pos.x, this.pos.y);
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