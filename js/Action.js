//Симулятор колонии муравьев

class Action {
    //Действия муравья
    static listAction=[
        Action.dead,
        Action.drop,
        Action.kick,
        Action.grab,
        Action.move,
        Action.back,
        Action.find,
        Action.info,
        Action.flex,
        Action.wait
    ];
    
    static dead(ant) {
        ant.life=0;
        ant.run=false;
        ant.color=Block.color;
        if (ant.load)
            ant.action=Action.drop;
        model.newFood(ant.pos);
        //удалить муравья с массива колонии
        model.map[ant.pos.x][ant.pos.y]=false;
        //delete(ant);
        ant.timer=ant.getDelay(ant.delay*10);
    }

    static drop(ant) {
        ant.run=false;
        if (ant.target instanceof Colony) {
            ant.target.food+=ant.load.weight;
            ant.life=100;
            ant.score+=50;
        } else {
            let food=new Food(ant.pos);
            food.weight=ant.load.weight;
            model.listFood.push(food);
            model.map[food.pos.x][food.pos.y]=food;
        }
        ant.load=false;
        ant.goal=constructor;
        ant.timer=ant.getDelay(ant.delay);
    }

    static kick(ant) {
        ant.run=false;
        //проверить близость корма или противника,
        ant.angle=ant.getAngle(ant.pos, ant.target);
        //шаг перед или назад,
        ant.score+=100;
        ant.timer=ant.getDelay(ant.delay*4);
    }

    static grab(ant) {
        ant.run=false;
        ant.goal=Colony;
        let food=Math.min(ant.target.weight, Math.floor(ant.life*0.7+Math.random()*ant.life*0.3));
        ant.target.weight-=food;
        ant.load=new Food(ant.pos);
        ant.load.weight=food;
        ant.score+=50;
        ant.life=100;
        ant.timer=ant.getDelay(ant.delay*3);
        if (ant.target.weight<1)
            model.delFood(ant);
    }

    static move(ant) {
        ant.run=true;
        ant.angle=ant.getAngle(ant.pos, ant.target);
        ant.timer=Math.floor(model.delta(ant.pos, ant.target)/ant.speed)-10;
    }

    static back(ant) {
        ant.run=true;
        ant.life=100;
        if (ant.load instanceof Food)
            ant.goal=Colony;
        else
            ant.goal=constructor;
        ant.target={pos: model.rndPos(this.pos, this.range)};
        ant.angle=ant.getAngle(ant.pos, ant.target);
        ant.timer=Math.floor(model.delta(ant.pos, ant.target)/ant.speed);
    }

    static find(ant) {
        ant.run=true;
        ant.goal=Food;
        ant.target={pos: model.rndPos(this.pos, this.range)};
        ant.angle=ant.getAngle(ant.pos, ant.target);
        ant.timer=Math.floor(model.delta(ant.pos, ant.target)/ant.speed);
    }

    static info(ant) {
        ant.run=false;
        ant.angle=ant.getAngle(ant.pos, ant.target);
        if (ant.score>ant.contact.score*0.75) {
            //копирование весов нейронов
            ant.score+=20;
        }
        ant.timer=ant.getDelay(ant.delay*2);
    }

    static flex(ant) {
        ant.target.pos=ant.pos;
        ant.run=true;
        ant.timer=ant.getDelay(ant.delay*8);
    }
    
    static wait(ant) {
        ant.run=false;
        ant.timer=ant.getDelay(ant.delay);
    }
}