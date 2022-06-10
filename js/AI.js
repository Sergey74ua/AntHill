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
    countIn=11; // life, target, 7 listTarget, food, rock
    countA=8;
    countB=12;
    countOut=10; // move, drop, kick, fund, grab, back, find, info, flex, wait

    // Искуственный интеллект (нейросеть)
    constructor() {
        // Входящая нада
        this.inputNodes=this.fillNodes(this.countIn);
        // Промежуточные ноды
        this.hidenNodesA=this.fillNodes(this.countA);
        this.hidenNodesB=this.fillNodes(this.countB);
        // Исходящая нода
        this.outputNodes=this.fillNodes(this.countOut);
    }

    init(ant) { //Заполняем веса рандомами
        ant.nn.in_a=this.randSynapse(this.countIn, this.countA);
        ant.nn.a_b=this.randSynapse(this.countA, this.countB);
        ant.nn.b_out=this.randSynapse(this.countB, this.countOut);
    }

    // Выбор действия
    select(ant) {
        // Смерть - если жизни нет
        if (ant.life<=0)
            return Action.dead;
        else {
            this.normInput(ant);
            this.hidenNodesA=this.synapse(this.inputNodes, ant.nn.in_a, this.hidenNodesA);
            this.hidenNodesA=this.normal(this.hidenNodesA);
            this.hidenNodesA=this.synapse(this.hidenNodesA, ant.nn.a_b, this.hidenNodesB);
            this.hidenNodesA=this.normal(this.hidenNodesB);
            this.hidenNodesA=this.synapse(this.hidenNodesB, ant.nn.b_out, this.outputNodes);
            this.hidenNodesA=this.normal(this.outputNodes);
            this.outputNodes[6]=0.9999; //////////////////////////////////////////////////////
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

    // Инициализация ноды
    fillNodes(count) {
        let nodes=[];
        for (let i=0; i<count; i++)
            nodes[i]=0.0;
        return nodes;
    }

    // Рандомные веса синапсов
    randSynapse(root, branch) {
        let node=[];
        for (let i=0; i<root; i++) {
            node[i]=[];
            for (let j=0; j<branch; j++)
                node[i][j]=Math.random();
        }
        return node;
    }

    // Рассчет синаптических связей
    synapse(start, weight, finish) {
        for (let i=0; i<start.length; i++)
            for (let j=0; j<finish.length; j++)
                finish weight;
        return finish;
    }

    // Нормировка ноды
    normal(nodes) {
        //Math.exp()
        // e**x/(1+e**x);
    }
}
