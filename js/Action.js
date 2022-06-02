// Симулятор колонии муравьев

class Action {
    // Действия муравья
    static listAction=[
        Action.dead,
        Action.view,
        Action.turn,
        Action.move,
        Action.drop,
        Action.kick,
        Action.fund,
        Action.grab,
        Action.back,
        Action.find,
        Action.info,
        Action.flex,
        Action.wait
    ];
    
    static dead(ant) {
        ant.run=false;
        ant.color='#00000040';
        if (ant.load instanceof Food)
            model.newFood(model.randPos(ant.pos, 4), ant.load.weight);
        else if (ant.load instanceof Rock)
            model.newRock(model.randPos(ant.pos, 4));
        ant.load=false;
    }

    static view(ant) { /////////////////////////////
        ant.listTarget=ant.vision();
        ant.timer=this.range;
    }

    static turn(ant) { /////////////////////////////
        ant.timer=Math.round(Math.abs(ant.angle-ant.getAngle(ant.pos, ant.target))/3.0);
        ant.angle=ant.getAngle(ant.pos, ant.target);
        
        /*let angle=(ant.angle*180/Math.PI+450)%360;
        //Текущий угол поворота к цели
        if (Math.abs(ant.angle-angle)>3.0) {
            if ((ant.angle < angle && (angle - ant.angle) < 180) ^ (angle - ant.angle) > -180)
                ant.angle = (ant.angle - 3.0 + 360) % 360;
            else
                ant.angle = (ant.angle + 3.0) % 360;
        } else
            ant.angle = angle;*/
    }

    static move(ant) {
        ant.run=true;
        ant.angle=ant.getAngle(ant.pos, ant.target);
        ant.timer=Math.round(model.delta(ant.pos, ant.target)/ant.speed-10/ant.speed);
    }

    static drop(ant) {
        ant.run=false;
        model.newFood(ant.pos, ant.load.weight); // а если был камень?
        ant.timer=ant.randDelay(ant.delay);
        ant.load=false;
        ant.speed=1.0;
        ant.target=false;
    }

    static kick(ant) {
        ant.run=false;
        ant.listTarget.alien=ant.target;
        ant.angle=ant.getAngle(ant.pos, ant.target);
        ant.target.life-=10;
        // Анимация атаки
        ant.score+=100;
        ant.timer=ant.randDelay(ant.delay);
        ant.target=false;
    }

    static fund(ant) {
        ant.run=false;
        ant.timer=ant.load.weight;
        ant.target.weight+=ant.load.weight;
        ant.life=100;
        ant.score+=50;
        ant.load=false;
        ant.speed=1.0;
        ant.target=false;
    }

    static grab(ant) {
        ant.run=false;
        let food=Math.min(ant.target.weight, Math.floor(ant.life*0.5+Math.random()*ant.life*0.5));
        ant.target.weight-=food;
        ant.load=new Food(ant.pos, food);
        ant.speed=1.0-food/200;
        ant.timer=food;
        ant.score+=50;
        ant.life=100;
        if (ant.target.weight<1)
            model.delFood();
        ant.target=false;
    }

    static back(ant) {
        ant.run=true;
        if (ant.listTarget.colony)
            ant.target=ant.listTarget.colony;
        else if (ant.listTarget.labAnt)
            ant.target=ant.listTarget.labAnt;
        else
            ant.target=ant.listTarget.random;
        ant.angle=ant.getAngle(ant.pos, ant.target);
        ant.timer=Math.floor(model.delta(ant.pos, ant.target)/ant.speed-10/ant.speed);
    }

    static find(ant) {
        ant.run=true;
        if (ant.listTarget.food)
            ant.target=ant.listTarget.food;
        else if (ant.listTarget.alien)
            ant.target=ant.listTarget.alien;
        else if (ant.listTarget.labFood)
            ant.target=ant.listTarget.labFood;
        else if (ant.listTarget.ally)
            ant.target=ant.listTarget.ally;
        else if (ant.listTarget.rock && Math.round(Math.random()*0.5))
            ant.target=ant.listTarget.rock;
        else
            ant.target=ant.listTarget.random;
        ant.angle=ant.getAngle(ant.pos, ant.target);
        ant.timer=Math.floor(model.delta(ant.pos, ant.target)/ant.speed-10/ant.speed);
    }

    static info(ant) {
        ant.run=false;
        ant.listTarget.ally=ant.target;
        ant.angle=ant.getAngle(ant.pos, ant.target);
        if (ant.score>ant.target.score*1.3) {
            // Копирование весов нейронов себе
            ant.score+=20;
        }
        ant.timer=ant.randDelay(ant.delay*2);
    }

    static flex(ant) {
        ant.speed=0;
        ant.run=true;
        // Анимация танца
        ant.timer=ant.randDelay(ant.delay*5);
    }
    
    static wait(ant) {
        ant.run=false;
        ant.timer=ant.randDelay(ant.delay);
        ant.target=false;
    }
}
