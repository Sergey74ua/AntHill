// Симулятор колонии муравьев

class RI {
    // Рандомный интеллект
    select(ant) {
        if (ant.life<=0)
            return Action.dead;
        else
            return Action.listAction[Math.floor(Math.random()*Action.listAction.length)];
    }
}

class PI {
    // Программируемый интеллект
    select(ant) {
        // Смерть - если жизни нет
        if (ant.life<=0)
            return Action.dead;
        // Осмотреться, если нет цели /////////////////////
        else if (false && !ant.listTarget.random)
            return Action.view;
        // Поворот на цель ////////////////////////////////
        else if (false && ant.target && Math.abs(ant.angle-ant.getAngle(ant.pos, ant.target))>3.0)
            return Action.turn;
        // Подход - если видна цель
        else if (ant.target && model.delta(ant.pos, ant.target)>=10/ant.speed)
            return Action.move;
        // Сброс - если есть корм и тебя атакует враг (МОЖЕТ РАЗДЕЛИТЬ ПО РАЗНЫМ ПУНКТАМ?)
        else if (/*ant.load instanceof Rock || */(ant.load && ant.target instanceof Ant && ant.target.color!=ant.color && ant.target.life>0))
            return Action.drop;
        // Атака - если тебя атакуют или рядом чужой муравей с кормом (КАК ОН АТАКУЕТ САМ ???)
        else if (ant.target instanceof Ant && ant.target.color!=ant.color)
            return Action.kick;
        // Выгрузка в муравейник
        else if (ant.load && ant.target instanceof Colony)
            return Action.fund;
        // Сбор - если нет корма и рядом корм (МОЖЕТ РАЗДЕЛИТЬ ПО РАЗНЫМ ПУНКТАМ?)
        else if (!ant.load && (ant.target instanceof Food /*|| ant.target instanceof Rock*/))
            return Action.grab;
        // Возврат - если есть корм
        else if (ant.load instanceof Food)
            return Action.back;
        // Поиск - если нет корма и нет других задач
        else if (!ant.load)
            return Action.find;
        // Обучение - если в контакте с союзником (МОЖЕТ РАЗДЕЛИТЬ ПО РАЗНЫМ ПУНКТАМ?)
        else if (!ant.load && ant.target instanceof Ant && ant.target.color==ant.color)
            return Action.info;
        // Танец - к примеру, если одолел противника /////////////////////////////////
        else if (ant.target instanceof Ant && ant.target.life<1)
            return Action.flex;
        // Ожидание - все прочее
        else
            return Action.wait;
    }
}

class AI {
    // Искуственный интеллект (нейросеть)
    constructor() {
        // Входящая нада
        this.inputNodes = new Array(11);
        // Промежуточные ноды
        this.hidenNodes1 = new Array(8);
        this.hidenNodes2 = new Array(12);
        // Исходящая нода (move, drop, kick, fund, grab, back, find, info, flex, wait)
        this.outputNodes=new Array(10);
    }

    init(ant) {
        for (let i=0; i<this.inputNodes.length; i++)
            console.log('inputNodes - ', i);
        for (let i=0; i<this.hidenNodes1.length; i++)
            console.log('hidenNodes1 - ', i);
        for (let i=0; i<this.hidenNodes2.length; i++)
            console.log('hidenNodes2 - ', i);
        for (let i=0; i<this.outputNodes.length; i++)
            console.log('outputNodes - ', i);
    }

    // Выбор действия
    select(ant) {
        // Смерть - если жизни нет
        if (ant.life<=0)
            return Action.dead;
        else {
            // Инициализация и нормировка входящей ноды
            this.normInput(ant);
            // Цикл по нодам
            for (let node in ant.nn) {
                // Рассчет синаптических связей ноды
                this.synapse(ant);
                // Нормировка ноды
                this.normal();
            };
            ////////////////////////////////////////////////////////////////////
            this.outputNodes=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0];
            return Action.listAction[this.outputNodes.indexOf(Math.max(...this.outputNodes))];
        }
    }

    // Нормировка входящих данных
    normInput(ant) {
        this.inputNodes=[
            ant.life/=100,
            !!ant.target,
            !!ant.listTarget.colony,
            !!ant.listTarget.ally,
            !!ant.listTarget.alien,
            !!ant.listTarget.food,
            !!ant.listTarget.rock,
            !!ant.listTarget.labFood,
            !!ant.listTarget.labAnt,
            ant.load instanceof Food,
            ant.load instanceof Rock,
        ];
    }

    // Рассчет синаптических связей
    synapse(ant) {
        ;
    }

    // Нормировка ноды
    normal() {
        ;
    }
}