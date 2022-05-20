//Симулятор колонии муравьев

class Control {
    //Управление
    constructor() {
        this.game=true;
        this.focus=false;
        this.info=false;
        this.fps=1000/75;
        
        this.btnPlay=document.getElementById('play');
        this.btnClear=document.getElementById('clear');
        this.btnSave=document.getElementById('save');
        this.btnPlay.addEventListener('click', this.play.bind(this));
        this.btnClear.addEventListener('click', this.clear.bind(this));
        this.btnSave.addEventListener('click', this.save.bind(this));

        onclick=(e) => this.onClick(e);
        onkeydown=(e) => this.onKeyDown(e);
        setInterval(() => this.update(), this.fps);
    }

    //Обновление
    update() {
        if (this.game)
            model.update();
        view.draw();
    }

    //Отслеживае кликов мышки
    onClick(e) {
        if (!this.focus) {
            let pos={
                x: e.clientX,
                y: e.clientY
            };
            model.newFood(pos);
        }
        this.focus=false;
    }

    //Отслеживае клавиатуры
    onKeyDown(e) {
        e.preventDefault();
		switch(e.keyCode) {
			case 17: case 18:
                this.info=!this.info;
                break;
            case 19: case 32:
                this.play();
                break;
		}
    }
    
    //Кнопка старт/пауза
    play() {
        this.focus=true;
        this.game=!this.game;
        this.btnName();
    }

    //Кнопка очистка
    clear() {
        this.focus=true;
        //this.play=false;
        this.btnName();
        //Предложение сохранения
        model=new Model();
    }

    //Кнопка сохранения
    save() {
        this.focus=true;
        console.log('Кнопка Save');
    }

    //Функция старт/пауза
    btnName() {
        if (this.game)
            this.btnPlay.innerHTML='<i class="fa fa-pause" aria-hidden="true"></i>';
        else
            this.btnPlay.innerHTML='<i class="fa fa-play" aria-hidden="true"></i>';
    }

    /*
    - window.addEventListener('resize', onResize);
    //Размер игровой карты
    resize() {
        if (this.size.width<=canvas.width)
            this.size.width=canvas.width;
        else
            this.size.width=this.size.width; //Проверка на наличие объектов
        if (this.size.height<=canvas.height)
            this.size.height=canvas.height;
        else
            this.size.height=this.size.height; //Проверка на наличие объектов
        ctx.shadowColor='Black';
    }
    */
}

/*
ЗАГРУЗКА
- инициализация базовых данных управления:
    -- старт/пауза
    -- сохранение/загрузка
    -- рестарт (сохранение)

СТАРТ/РЕСТАРТ
- сброс базовых данных

ШАГ ИГРЫ
- игровой цикл
*/
