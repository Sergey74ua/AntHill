//Симулятор колонии муравьев

class Colony {
    
    pallet=[
        'SaddleBrown',
        'DarkKhaki',
        'DimGrey',
        'Maroon'
    ];

    constructor(i, pos, food) {
        this.food=food;
        this.pos=pos;
        this.color=this.getColor(i);
        this.ai=new PI();
        this.listAnt=[];
        this.delay=200;
        this.timer=Math.round(this.delay/4);
    }

    //Обновление
    update() {
        if (this.food>0)
            this.timer--;
            if (this.timer<0) {
                this.listAnt.push(new Ant(this));
                this.food-=100;
                this.timer=this.delay;
            }
    }

    //Отрисовка
    draw(ctx) {
        let grad=ctx.createRadialGradient(this.pos.x, this.pos.y, 8,
            this.pos.x, this.pos.y, 32);
        grad.addColorStop(0, this.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle=grad;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 32, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        //Информация
        if (control.info) {
            ctx.fillStyle='White';
            ctx.font="8pt Arial";
            ctx.fillText(this.listAnt.length, this.pos.x, this.pos.y);
        }
    }
    
    //Цвет колонии
    getColor(i) {
        let color;
        if (i<this.pallet.length)
            color=this.pallet[i];
        else
            color='#'+Math.floor(Math.random()*16777216).toString(16).padStart(6, '0');
        return color;
    }

    //Удаление муравья
    delAnt() {
        ;
    }
}