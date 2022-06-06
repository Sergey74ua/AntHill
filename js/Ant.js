// Симулятор колонии муравьев

class Ant {
    // Муравей
    constructor(colony) {
        this.color=colony.color;
        this.pos=model.randPos(colony.pos, 4);
        this.life=100.0;
        this.load=false;
        this.speed=1.0;
        this.step=1/this.speed*5;
        this.run=false;
        this.pose=false;
        this.delay=25;
        this.timer=0;
        this.range=48;
        this.target=false;
        this.angle=false;
        this.action=Action.wait;
        this.listTarget=this.vision();
        this.score=0;
        this.ai=colony.ai;
        if (this.ai instanceof AI) {
            this.nn={ //////////////////////////////////
                w_1: new Array(11), // [11*8],
                w_2: new Array(8),  // [8*12],
                w_3: new Array(12)  // [12*10]
            };
            this.ai.init(this);
        }
    }

    // Обновление
    update() {
        this.timer--;
        this.life-=0.01;
        // Смена режима
        if (this.timer<=0) {
            this.listTarget=this.vision();
            this.action=this.ai.select(this);
            this.action(this);
        }
        // Движение муравья
        if (this.run)
            this.goStep();
    }

    // Отрисовка
    draw(ctx, fw) {
        let x=this.pos.x, y=this.pos.y, angle=this.angle;
        let pose=this.pose*0.5;
        // Смена координат для поворота
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.translate(-x, -y);
        // Корм
        if (this.load) {
            this.load.pos={x: x, y: y-fw.size4};
            this.load.draw(ctx);
        }
        // Цвета и линии
        ctx.lineWidth=this.line;
        ctx.strokeStyle='Black';
        ctx.fillStyle=this.color;
        // Тени
        ctx.shadowBlur=3;
        ctx.shadowOffsetX=2;
        ctx.shadowOffsetY=1;
        // Лапки 1-4
        ctx.beginPath();
        ctx.moveTo(x-fw.size25, y-fw.size3-pose*2);
        ctx.lineTo(x-fw.size2, y-fw.size15-pose);
        ctx.lineTo(x+fw.size28, y+fw.size2+pose*2);
        ctx.lineTo(x+fw.size4, y+fw.size6+pose*4);
        // Лапки 2-5
        ctx.moveTo(x-fw.size35, y+fw.size+pose);
        ctx.lineTo(x-fw.size22, y-fw.size025+pose);
        ctx.lineTo(x+fw.size22, y+fw.size025-pose);
        ctx.lineTo(x+fw.size35, y+fw.size15-pose);
        // Лапки 3-6
        ctx.moveTo(x-fw.size4, y+fw.size8-pose*4);
        ctx.lineTo(x-fw.size28, y+fw.size3-pose*2);
        ctx.lineTo(x+fw.size2, y-fw.size2+pose);
        ctx.lineTo(x+fw.size25, y-fw.size4+pose*2);
        ctx.stroke();
        ctx.closePath();
        // Грудь
        ctx.beginPath();
        ctx.arc(x, y, fw.size, 0, Flyweight.Pi2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        // Голова
        ctx.beginPath();
        ctx.ellipse(x, y-fw.size2, fw.size125, fw.size, 0, 0, Flyweight.Pi2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        // Брюшко
        ctx.beginPath();
        ctx.ellipse(x, y+fw.size35, fw.size15, fw.size25, 0, 0, Flyweight.Pi2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        // Усики
        ctx.beginPath();
        ctx.moveTo(x-fw.size05, y-fw.size22);
        ctx.lineTo(x-fw.size15+pose*0.5, y-fw.size45);
        ctx.moveTo(x+fw.size05, y-fw.size22);
        ctx.lineTo(x+fw.size15-pose*0.5, y-fw.size45);
        ctx.stroke();
        ctx.closePath();
        // Сброс координат
        ctx.restore();
        ctx.shadowBlur=0;
        ctx.shadowOffsetX=0;
        ctx.shadowOffsetY=0;
        // Информация
        if (control.info) {
            // Информация муравья
            ctx.fillStyle=this.color;
            ctx.font="7pt Arial";
            ctx.fillText(this.action.name+' '+this.timer, x, y-16);
            // Диапазон всего обзора
            ctx.strokeStyle='Lime';
            ctx.strokeRect(x-this.range, y-this.range, this.range*2, this.range*2);
            // Цель
            if (this.target) {
                ctx.fillStyle='White';
                ctx.fillText('+', this.target.pos.x, this.target.pos.y);
            }
        }
    }
    
    // Осматриваем карту
    vision() {
        this.listTarget={
            colony: false,
            ally: false,
            alien: false,
            food: false,
            rock: false,
            labFood: false,
            labAnt: false,
            random: false
        };
        this.pos=model.roundPos(this.pos);
        for (let i=1; i<=this.range; i++) {
            let sector=model.getSector(this.pos, i);
            for (let j=sector.left; j<=sector.right; j++) {
                this.memory(model.map[j][sector.top], model.air[j][sector.top]);
                this.memory(model.map[j][sector.bottom], model.air[j][sector.bottom]);
            };
            for (let j=sector.top+1; j<=sector.bottom-1; j++) {
                this.memory(model.map[sector.left][j], model.air[sector.left][j]);
                this.memory(model.map[sector.right][j], model.air[sector.right][j]);
            };
        };
        this.listTarget.random={pos: model.randPos(this.pos, this.range)};
        return this.listTarget;
    }

    // Запоминаем объекты
    memory(point, smell) {
        // Видимые
        if (point instanceof Colony && point.color==this.color)
            this.listTarget.colony=point;
        else if (point instanceof Rock)
            this.listTarget.rock=point;
        else if (!this.listTarget.food && point instanceof Food)
            this.listTarget.food=point;
        else if (point instanceof Ant) {
            if (point.color==this.color && point.score>this.listTarget.ally.score)
                this.listTarget.ally=point;
            else if (point.color!=this.color && point.load instanceof Food)
                this.listTarget.alien=point;
        }
        // По запаху
        if (smell instanceof Label) {
            if (smell.color==Food.color && smell.weight<this.listTarget.labFood.weight)
                this.listTarget.labFood=smell;
            else if (smell.color==this.color && smell.weight>this.listTarget.labAnt.weight)
                this.listTarget.labAnt=smell; //НУЖНО ИСКЛЮЧИТЬ СВОЙ СЛЕД
        }
    }

    // Смена шагов
    goStep() {
        let pos=model.roundPos(this.pos);
        model.map[pos.x][pos.y]=false;
        let angle=this.angle-Math.PI/2;
        this.pos.x+=this.speed*Math.cos(angle);
        this.pos.y+=this.speed*Math.sin(angle);
        pos=model.roundPos(this.pos);
        model.map[pos.x][pos.y]=this;
        if (this.step<=0) {
            this.pose=!this.pose;
            this.step=1/this.speed*5;
            this.score++;
            if (this.pose)
                model.newLabel(this.color, pos);
            else if (this.load instanceof Food)
                model.newLabel(Food.color, pos);
        } else
            this.step--;
    }

    // Поворот на цель
    getAngle(pos, target) {
        return Math.atan2(target.pos.y-pos.y, target.pos.x-pos.x)+Flyweight.Pi05;
    }

    // Случайная длительность действия
    randDelay(delay) {
        return Math.round(delay*0.667+Math.random()*delay*0.667);
    }
}
