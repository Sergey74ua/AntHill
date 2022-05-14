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
        ant.run=false;
        ant.color=Block.color;
        if (ant.load instanceof Food) // а если был камень?
            model.newFood(ant.pos, ant.load.weight);
    }

    static drop(ant) {
        ant.run=false;
        if (ant.target instanceof Colony) {
            ant.target.food+=ant.load.weight;
            ant.timer=ant.load.weight;
            ant.life=100;
            ant.score+=50;
        } else {
            model.newFood(ant.pos, ant.load.weight);
            ant.timer=ant.getDelay(ant.delay);
        }
        ant.load=false;
        ant.speed=1.0;
        ant.goal=constructor;
    }

    static kick(ant) {
        ant.run=false;
        ant.target.target=ant;
        ant.angle=ant.getAngle(ant.pos, ant.target);
        //шаг перед или назад,
        ant.score+=100;
        ant.timer=ant.getDelay(ant.delay*4);
    }

    static grab(ant) {
        ant.run=false;
        ant.goal=Colony;
        let food=Math.min(ant.target.weight, Math.floor(ant.life*0.5+Math.random()*ant.life*0.5));
        ant.target.weight-=food;
        ant.load=new Food(ant.pos);
        ant.load.weight=food;
        ant.speed=1.0-food/200;
        ant.timer=food;
        ant.score+=50;
        ant.life=100;
        if (ant.target.weight<1)
            model.delFood();
    }

    static move(ant) {
        ant.run=true;
        ant.angle=ant.getAngle(ant.pos, ant.target);
        ant.timer=Math.round(model.delta(ant.pos, ant.target)/ant.speed-ant.speed*10);
    }

    static back(ant) {
        ant.run=true;
        ant.life=100;
        if (ant.load instanceof Food)
            ant.goal=Colony;
        else
            ant.goal=constructor;
        ant.angle=ant.getAngle(ant.pos, ant.target);
        ant.timer=Math.round(model.delta(ant.pos, ant.target)/ant.speed-ant.speed*2);
    }

    static find(ant) {
        ant.run=true;
        ant.goal=Food;
        ant.angle=ant.getAngle(ant.pos, ant.target);
        ant.timer=Math.floor(model.delta(ant.pos, ant.target)/ant.speed-ant.speed*2);
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
        ant.speed=0;
        ant.run=true;
        ant.timer=ant.getDelay(ant.delay*8);
    }
    
    static wait(ant) {
        ant.run=false;
        ant.timer=ant.getDelay(ant.delay);
    }
}