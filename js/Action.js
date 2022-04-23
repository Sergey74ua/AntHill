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
    
    static dead(ant) { ///////////////////////
        ant.timer=ant.getDelay(ant.delay*6);
        ant.run=false;
        if (ant.delay<0) {
            if (ant.food>0) {
                let food=new Food(ant.pos);
                food.weight=ant.food;
                model.listFood.push(food);
                model.map[food.pos.x][food.pos.y]=food;
            }
            model.newFood(ant.pos)
            //удалить муравья с массива колонии
            model.map[ant.pos.x][ant.pos.y]={};
            //delete(ant);
        }
    }

    static drop(ant) {
        ant.timer=ant.getDelay(ant.delay);
        ant.run=false;
        //проверить близость своего муравейника
        // и добавить корм в колонию,
        //или найти свободную точку для сброса корма
        // и добавть корм на точку,
        //убрать корм с муравья,
        ant.score+=50;
        //ant.action=Action.wait;
    }

    static kick(ant) {
        ant.timer=ant.getDelay(ant.delay*4);
        ant.run=false;
        //проверить близость корма или противника,
        ant.angle=ant.getAngle(ant.pos, ant.target);
        //шаг перед или назад,
        ant.score+=100;
        //ant.action=Action.wait;
    }

    static grab(ant) {
        ant.timer=ant.getDelay(ant.delay*3);
        ant.run=false;
        ant.goal=Colony;
        let food=Math.min(ant.target.weight, ant.life);
        ant.target.weight-=food;
        ant.load=new Food(ant.pos);
        ant.score+=50;
    }

    static move(ant) {
        ant.timer=Math.round(model.delta(ant.pos, ant.target)/ant.speed);
        ant.run=true;
        ant.angle=ant.getAngle(ant.pos, ant.target);
    }

    static back(ant) {
        ant.timer=ant.getDelay(ant.delay*5);
        ant.run=true;
        if (ant.load instanceof Food)
            ant.goal=Colony;
        else
            ant.goal=constructor;
        ant.target={pos: model.rndPos(this.pos, this.range)};
        ant.angle=ant.getAngle(ant.pos, ant.target);
    }

    static find(ant) {
        ant.timer=ant.getDelay(ant.delay*4);
        ant.run=true;
        ant.goal=Food;
        ant.target={pos: model.rndPos(this.pos, this.range)};
        ant.angle=ant.getAngle(ant.pos, ant.target);
    }

    static info(ant) {
        ant.timer=ant.getDelay(ant.delay*2);
        ant.run=false;
        ant.angle=ant.getAngle(ant.pos, ant.target);
        if (ant.score>ant.contact.score*0.75) {
            //копирование весов нейронов
            ant.score+=20;
        }
        //ant.action=Action.wait;
    }

    static flex(ant) {
        ant.timer=ant.getDelay(ant.delay*8);
        ant.target.pos=ant.pos;
        ant.run=true;
    }
    
    static wait(ant) {
        ant.timer=ant.getDelay(ant.delay);
        ant.run=false;
        //ant.action=Action.wait;
    }
}