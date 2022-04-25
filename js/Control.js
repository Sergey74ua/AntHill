//Симулятор колонии муравьев

class Control {
    //Управление
    constructor() {
        this.game=true;
        this.focus=false;
        this.info=false;
        this.fps=40;
        
        this.btnPlay=document.getElementById('play');
        this.btnClear=document.getElementById('clear');
        this.btnPlay.addEventListener('click', this.play.bind(this));
        this.btnClear.addEventListener('click', this.clear.bind(this));

        setInterval(() => this.update(), this.fps);
        onclick=(e) => this.onClick(e);
        onkeydown=(e) => this.onKeyDown(e);
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

    //Функция старт/пауза
    btnName() {
        if (this.game)
            this.btnPlay.innerHTML='<i class="fa fa-pause" aria-hidden="true"></i>';
        else
            this.btnPlay.innerHTML='<i class="fa fa-play" aria-hidden="true"></i>';
    }
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
