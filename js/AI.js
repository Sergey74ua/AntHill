//Симулятор колонии муравьев

class RI {
    //Рандомный интеллект
    select(ant) {
        ant.action=Action.listAction[Math.floor(Math.random()*Action.listAction.length)];
    }
}

class PI { //////////////////////////////
    //Программируемый интеллект
    select(ant) {
        //Сброс - если есть корм и (рядом свой муравейник или тебя атакуют)
        if (ant.food>0 && (false || ant.life<100)) //урон-?
            ant.action=Action.drop;
        //Атака - если тебя атакуют и рядом чужой муравей
        else if (ant.lose>0)  //урон-?
            ant.action=Action.kick;
        //Сбор - если нет корма и рядом корм
        else if (ant.food<=0 && typeof(ant.target)==Food)
            ant.action=Action.grab;
        //Подход - если виден корм или муравейник
        else if (ant.target instanceof Food)
            ant.action=Action.move;
        //Возврат - если есть корм
        else if (ant.load)
            ant.action=Action.back;
        //Поиск - если нет корма и корм не виден
        else if (!ant.load)
            ant.action=Action.find;
        //Обучение - если в контакте с союзником
        else if (typeof(ant.target)==Ant && ant.target.score>ant.score)
            ant.action=Action.info;
        //Смерть - если жизни нет
        else if (ant.life<0)
            ant.action=Action.dead;
        //Ожидание - все прочее
        else
            ant.action=Action.wait;
    }
}

class AI { //////////////////////////////
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