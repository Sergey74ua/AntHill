// Симулятор колонии муравьев
const
    FPS=75;
    BASE=5;
    SIZE=2;

var model,
    view,
    control;

let listLib=[
    'FileSaver'
];

let listClass=[
    'AI',
    'Action',
    'Ant',
    'Colony',
    'Items',
    'Model',
    'View',
    'Control'
];

// Подключение скриптов
for (let name of listClass) {
    let script=document.createElement('script');
    script.type='application/javascript';
    script.src='js/'+name+'.js';
    document.body.appendChild(script);
}

// Подключение библиотек
for (let name of listLib) {
   let script=document.createElement('script');
   script.type='application/javascript';
   script.src='libs/'+name+'.js';
   document.body.appendChild(script);
}

// MVC
window.onload=() => {
    model=new Model();
    view=new View();
    control=new Control();
}