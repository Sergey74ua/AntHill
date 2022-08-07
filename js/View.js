// Симулятор колонии муравьев

class View {
    // Представление
    constructor() {
        this.canvas=document.getElementById('canvas');
        this.onResize();
        window.addEventListener('resize', this.onResize);
        this.soundGrab=new Audio('files/grab.ogg');
        this.soundKick=new Audio('files/kick.mp3');
        this.soundDead=new Audio('files/dead.mp3');
    }

    // Отрисовка экрана
    draw() {
        this.ctx.fillStyle='DarkGreen';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        //if (control.info)
            for (let label of model.listLabel)
                label.draw(this.ctx);

        for (let block of model.listBlock)
            block.draw(this.ctx);

        for (let rock of model.listRock)
            rock.draw(this.ctx);

        for (let food of model.listFood)
            food.draw(this.ctx);

        for (let colony of model.listColony)
            for (let ant of colony.listAnt)
                ant.draw(this.ctx, this.fw);

        for (let colony of model.listColony)
            colony.draw(this.ctx);
    }

    // Выравнивание экрана по размерам окна
    onResize() {
        this.canvas.width=model.size.width;
        this.canvas.height=model.size.height;
        this.ctx=this.canvas.getContext('2d');
        this.ctx.shadowColor='Black';
        this.ctx.textBaseline="middle";
        this.ctx.textAlign="center";
        this.fw=new Flyweight();
    }
}

class Flyweight {
    static Pi05=Math.PI/2;
    static Pi2=Math.PI*2;

    // Статичные данные
    constructor() {
        this.size=SIZE;
        this.line=this.size*0.2;
        this.size025=this.size*0.25;
        this.size05=this.size*0.5;
        this.size125=this.size*1.25;
        this.size15=this.size*1.5;
        this.size2=this.size*2;
        this.size22=this.size*2.2;
        this.size25=this.size*2.5;
        this.size28=this.size*2.8;
        this.size3=this.size*3;
        this.size35=this.size*3.5;
        this.size4=this.size*4;
        this.size45=this.size*4.5;
        this.size6=this.size*6;
        this.size8=this.size*8;
    }
}