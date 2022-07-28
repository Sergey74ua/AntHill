// Симулятор колонии муравьев

class Action {
    // Действия муравья
    static listAction=[
        //Action.dead,
        //Action.view,
        //Action.turn,
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
        if (ant.target) {
            ant.angle=ant.getAngle(ant.pos, ant.target);
            ant.timer=Math.round(model.delta(ant.pos, ant.target)/ant.speed-10);
            ant.run=true;
        }
    }

    static drop(ant) {
        ant.run=false;
        if (ant.load instanceof Food)
            model.newFood(model.randPos(ant.pos, 4), ant.load.weight);
        else if (ant.load instanceof Rock)
            model.newRock(model.randPos(ant.pos, 4));
        ant.load=false;
        ant.timer=ant.randDelay(ant.delay);
        ant.speed=2.0;
        //ant.target=false;
    }

    static kick(ant) {
        if (ant.target instanceof Ant && ant.target.color!=this.color) {
            ant.listTarget.alien=ant.target;
            ant.angle=ant.getAngle(ant.pos, ant.target);
            ant.target.life-=10;
            ant.score+=100;
            if (ant.target.life<=0) {
                ant.frag+=1;
                ant.score+=1000;
            }
            console.log('АТАКА - ', ant.target.load); //////////////////
        }
        ant.run=false;
        // Анимация атаки
        ant.timer=ant.randDelay(ant.delay);
        ant.target=false;
    }

    static fund(ant) {
        if (ant.load instanceof Food) {
            ant.timer=ant.load.weight;
            ant.target.weight+=ant.load.weight;
            ant.score+=50;
            ant.load=false;
        }
        ant.run=false;
        ant.life=100;
        ant.speed=2.0;
        ant.target=false;
    }

    static grab(ant) {
        if (ant.target instanceof Food) {
            let food=Math.min(ant.target.weight, Math.floor(ant.life*0.5+Math.random()*ant.life*0.5));
            ant.target.weight-=food;
            ant.load=new Food(ant.pos, food);
            ant.speed=2.0-food/200;
            ant.timer=food;
            ant.score+=50;
            if (ant.target.weight<1)
                model.delFood();
        }
        ant.run=false;
        ant.life=100;
        ant.target=false;
    }

    static back(ant) {
        ant.run=true;
        if (ant.listTarget.colony)
            ant.target=ant.listTarget.colony;
        else if (ant.listTarget.labAnt && Math.round(Math.random()*0.7)) ///////////////
            ant.target=ant.listTarget.labAnt;
        else
            ant.target=ant.listTarget.random;
        ant.angle=ant.getAngle(ant.pos, ant.target);
        ant.timer=Math.floor(model.delta(ant.pos, ant.target)/ant.speed-10);
    }

    static find(ant) { // НУЖНО ПРОТЕСТИРОВАТЬ МЕТКИ И ДРУГОЕ
        ant.run=true;
        if (ant.listTarget.food)
            ant.target=ant.listTarget.food;
        else if (ant.listTarget.alien)
            ant.target=ant.listTarget.alien;
        else if (ant.listTarget.labFood && Math.round(Math.random()*1.5))
            ant.target=ant.listTarget.labFood;
        else if (ant.ai instanceof AI && ant.listTarget.ally)
            ant.target=ant.listTarget.ally;
        else if (ant.listTarget.rock && Math.round(Math.random()*0.5))
            ant.target=ant.listTarget.rock;
        else
            ant.target=ant.listTarget.random;
        ant.angle=ant.getAngle(ant.pos, ant.target);
        ant.timer=Math.floor(model.delta(ant.pos, ant.target)/ant.speed-10);
    }

    static info(ant) {
        if (ant.target instanceof Ant && ant.target.color==this.color) {
            ant.listTarget.ally=ant.target;
            ant.angle=ant.getAngle(ant.pos, ant.target);
            if (ant.score>ant.target.score*1.3) {
                // Копирование весов нейронов себе
                ant.score+=20;
            }
        }
        ant.run=false;
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
