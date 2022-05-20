//Симулятор колонии муравьев

class RI {
    //Рандомный интеллект
    select(ant) {
        ant.action=Action.listAction[Math.floor(Math.random()*Action.listAction.length)];
    }
}

class PI {
    //Программируемый интеллект
    select(ant) {
        //Смерть - если жизни нет
        if (ant.life<=0)
            return Action.dead;
        //Осмотреться, если нет цели /////////////////////
        else if (false && !ant.listTarget.random)
            return Action.view;
        //Поворот на цель ////////////////////////////////
        else if (false)
            return Action.turn;
        //Подход - если видна цель
        else if (ant.target && model.delta(ant.pos, ant.target)>ant.speed*12)
            return Action.move;
        //Сброс - если есть корм и тебя атакует враг (МОЖЕТ РАЗДЕЛИТЬ ПО РАЗНЫМ ПУНКТАМ?)
        else if (/*ant.load instanceof Rock || */(ant.load && ant.target instanceof Ant && ant.target.color!=ant.color && ant.target.life>0))
            return Action.drop;
        //Атака - если тебя атакуют или рядом чужой муравей с кормом (КАК ОН АТАКУЕТ САМ ???)
        else if (ant.target instanceof Ant && ant.target.color!=ant.color)
            return Action.kick;
        //Выгрузка в муравейник
        else if (ant.load && ant.target instanceof Colony)
            return Action.fund;
        //Сбор - если нет корма и рядом корм (МОЖЕТ РАЗДЕЛИТЬ ПО РАЗНЫМ ПУНКТАМ?)
        else if (!ant.load && (ant.target instanceof Food /*|| ant.target instanceof Rock*/))
            return Action.grab;
        //Возврат - если есть корм
        else if (ant.load instanceof Food)
            return Action.back;
        //Поиск - если нет корма и нет других задач
        else if (!ant.load)
            return Action.find;
        //Обучение - если в контакте с союзником (МОЖЕТ РАЗДЕЛИТЬ ПО РАЗНЫМ ПУНКТАМ?)
        else if (!ant.load && ant.target instanceof Ant && ant.target.color==ant.color)
            return Action.info;
        //Танец - к примеру, если одолел противника /////////////////////////////////
        else if (ant.target instanceof Ant && ant.target.life<1)
            return Action.flex;
        //Ожидание - все прочее
        else
            return Action.wait;
    }
}

class AI {
    //Искуственный интеллект (нейросеть)
    constructor() {
        input={
            life: 1,
            loss: 0,
            food: 0,
            rock: 0,
            run: 0,
            dead: 0,
            drop: 0,
            kick: 0,
            grab: 0,
            move: 0,
            back: 0,
            find: 0,
            info: 0,
            flex: 0,
            wait: 0,
            tgFood: 0,
            tgRock: 0,
            tgHill: 0,
            tgAlly: 0,
            tgEnemy: 0,
            vsFood: 0,
            vsRock: 0,
            vsHill: 0,
            vsAlly: 0,
            vsEnemy: 0,
            arFoodMin: 0,
            arFoodMax: 0,
            arAllyMin: 0,
            arAllyMax: 0,
            arEnemyMin: 0,
            arEnemyMax: 0
        };
    }

    select(ant) {
        ant.action=Action.listAction[getAct(ant)];
    }

    getAct(ant) {
        let neron=[
            n1=ant.life,
            n2=ant.food,
            n3=ant.run,
            n4=ant.target,
            n5=ant.action,
            n6=ant.listTarget //////////////////
        ];
        return 0;
    };
}