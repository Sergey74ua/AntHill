// Симулятор колонии муравьев

class View {
    // Представление
    constructor() {
        this.canvas=document.getElementById('canvas');
        this.onResize();
        window.addEventListener('resize', this.onResize);
    }

    // Отрисовка экрана
    draw() {
        this.ctx.fillStyle='DarkGreen';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

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

/*
//Синхронизация canvas с кадрами экрана
window.requestAnimationFrame=( function() {
	return	window.requestAnimationFrame     ||
			window.webkitRequestAnimationFrame  ||
			window.mozRequestAnimationFrame     ||
			window.oRequestAnimationFrame       ||
			window.msRequestAnimationFrame      ||
			function (callback) {
				window.setTimeout(callback, 1000/60);
			}
})();

//Вывод FPS
let fps=document.getElementById('fps');
let frameCount = function _fc(fastTimeStart, preciseTimeStart){
    let now = performance.now();
    let fastDuration = now - (fastTimeStart || _fc.startTime);
    let preciseDuration = now - (preciseTimeStart || _fc.startTime);
    if(fastDuration < 100)
        _fc.fastCounter++;
    else {
        _fc.fastFPS = _fc.fastCounter * 10;
        _fc.fastCounter = 0;
        fastTimeStart = now;
        //console.log(_fc.fastFPS);
    }
    if(preciseDuration < 1000)
        _fc.preciseCounter++;
    else {   
        _fc.preciseFPS = _fc.preciseCounter;
        _fc.preciseCounter = 0;
        preciseTimeStart = now; 
        //console.log(_fc.preciseFPS);
    }
    fps.innerHTML='fps: ' + _fc.fastFPS + ' - ' + _fc.preciseFPS;
    requestAnimationFrame(() => frameCount(fastTimeStart, preciseTimeStart)); 
}
frameCount.fastCounter = 0;
frameCount.fastFPS = 0;
frameCount.preciseCounter = 0;
frameCount.preciseFPS = 0;
frameCount.startTime = performance.now();
frameCount();
*/