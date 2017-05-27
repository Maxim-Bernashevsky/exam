
const getSeance = function (Request) {
    const data = JSON.parse(Request.responseText);
    console.dir(data);

    filmName.innerHTML = data.movie_name || 'Нет информации';
    $('p.filmDirector')[0].children[1].innerHTML = data.directed_by || 'Нет информации';
    $('p.filmActors')[0].children[1].innerHTML = data.actors || 'Нет информации';
    $('p.filmGenre')[0].children[1].innerHTML = data.genre_name || 'Нет информации';
    $('p.filmDescription')[0].children[1].innerHTML = data.desc || 'Нет информации';

    $('p.seanceDate')[0].innerHTML = data.seance_date || 'Нет информации';
    $('p.seanceTime')[0].innerHTML = data.seance_time || 'Нет информации';
    $('p.seancePrice')[0].children[1].innerHTML = data.seance_price || 'Нет информации';
    $('p.seanceHall')[0].children[1].innerHTML = data.cinema_name || 'Нет информации';

    pageHall.setAttribute('data-seance-id', data.seance_id);
    //pageHall.setAttribute('data-hall-id', data.hall_id);

    pageHall.setAttribute('href', 'hall.html?seance_id=' +  data.seance_id);
};



const getHall = function(Request) {
    console.log(Request.responseText);
    // const data = JSON.parse(Request.responseText);

};

function ReadFile(filename, container, filterData, type) {

    console.log(filterData)
    //Создаем функцию обработчик

    const search = function(Request) {
        //console.log(Request.responseText);
        const data = JSON.parse(Request.responseText);
        if(data.error){
            filmsTable.innerHTML = '';
            //console.log(data.error)
            $('#result').innerHTML = data.error;
        }else {
            filmsTable.innerHTML = '';
            data.forEach(tr => {
                let tableRow = document.createElement("tr");
                for (let td in tr) {
                    let tableData = document.createElement("td");
                    if (td !== 'seance_id') {
                        tableData.innerHTML = tr[td];
                        tableRow.appendChild(tableData);
                    }
                }
                tableRow.setAttribute('data-seance-id', tr['seance_id']);
                tableRow.value = tr['seance_id'];
                filmsTable.appendChild(tableRow);
                //console.log(tr['seance_id']);

            });
        }
    };





    let Handler;
    switch(type){
        case 'search':
            Handler = search;
            break;
        case 'getSeance':
            Handler = getSeance;
            break;
        case 'getHall':
            Handler = getHall;
            break;
        default:
        //
    }

    //document.getElementById(container).innerHTML = '<img src="Loader.gif" width="100"/>';
    //Отправляем запрос
    console.log(filterData);
    var request = 'type=' +  type + '&' + 'data=' + JSON.stringify(filterData);
    console.log('request', request);

    SendRequest("POST", filename, request, Handler);
}

function SendRequest(method, path, args, handler) {
    //Создаём запрос
    var Request = CreateRequest();
    //Проверяем существование запроса на текущем уровне
    if (!Request) {
        return false;
    }
    //Назначаем пользовательский обработчик
    Request.onreadystatechange = function() {
        //Если обмен данными завершен
        if (Request.readyState == 4) {
            if (Request.status == 200) {
                //Передаем управление обработчику пользователя
                handler(Request);
            }
            else {
                //Оповещаем пользователя о произошедшей ошибке
            }
        }
        else {
            console.warn(Request.readyState);
        }

    }
    //Проверяем, если требуется сделать GET-запрос
    if (method.toLowerCase() == "get" && args.length > 0) {
        path += "?" + args;
    }
    //Инициализируем соединение
    Request.open(method, path, true);
    if (method.toLowerCase() == "post") {
        //Если это POST-запрос, то устанавливаем заголовок
        Request.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
        //Посылаем запрос
        Request.send(args);
    }
    else {
        //Если это GET-запрос, то посылаем нул-запрос
        Request.send(null);
    }
}

function CreateRequest() {
    var Request = false;
    if (window.XMLHttpRequest) {
        //Gecko-совместимые браузеры, Safari, Konqueror
        Request = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        //Internet explorer
        try {
            Request = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch (CatchException) {
            Request = new ActiveXObject("Msxml2.XMLHTTP");
        }
    }
    if (!Request) {
        alert("Невозможно создать XMLHttpRequest");
    }
    return Request;
}

