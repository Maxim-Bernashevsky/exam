
$( function() {
    /* RU datepicker */
    $.datepicker.regional['ru'] = {
        dateFormat:'dd/mm/yy',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель',
            'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь',
            'Октябрь', 'Ноябрь', 'Декабрь'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        firstDay: 1,
    };
    $.datepicker.setDefaults( $.datepicker.regional[ "ru" ] );
    /**/

    const configTimepicker = {
        datepicker:false,
        format:'H:i',
//                allowTimes:[
//            '12:00', '13:00', '15:00',
//            '17:00', '17:05', '17:20', '19:00', '20:00'
//            ]
    };


    $( "#dateStart" ).datepicker();
    $( "#dateEnd" ).datepicker();
    $('#timeStart').datetimepicker(configTimepicker);
    $('#timeEnd').datetimepicker(configTimepicker);
    $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 75, 300 ],
        slide: function( event, ui ) {
            $( "#price" ).val( ui.values[ 0 ] + "-" + ui.values[ 1 ] + " ₽" );
        },
        change: changePrice
    });
    $( "#priceMin" ).val($('#slider-range').slider('values', 0));
    $( "#priceMax" ).val($('#slider-range').slider('values', 1));


    $( "#price" ).val(  $( "#slider-range" ).slider( "values", 0 ) +
        "-" + $( "#slider-range" ).slider( "values", 1 ) + ' ₽' );



    $( "#dateStart" ).on( "change", function( event ) {
        //console.log( JSON.stringify($( "#filterCinema" ).serializeArray()) );
        //var data =  JSON.stringify($( "#filterCinema" ).serializeArray());
       // filterData();
        ReadFile('service.php', 'result', filterData(), 'search');
    });
    function filterData() {
        return {
            dateStart: dateStart.value || null,
            dateEnd: dateEnd.value || null,
            film: film.value || null,
            genre: genre.value || null,
            timeStart: timeStart.value || null,
            timeEnd: timeEnd.value || null,
            priceMin: priceMin.value || null,
            priceMax: priceMax.value || null
        };
    }

    function getFilmId(){
        console.log('iddddd', $('#myModal').attr('data-movie-id'));
        return {
            cinema_id: $('#myModal').attr('data-movie-id')
        }
    }

    $( "#dateEnd" ).on( "change", function( event ) {
        //console.log( $( "#filterCinema" ).serialize() );
        ReadFile('service.php', 'result', filterData(), 'search');
    });

    $( "#film" ).on( "keyup", function( event ) {
        //console.log( JSON.stringify($( "#filterCinema" ).serializeArray()) );
        const data = filterData();
        if(data.film && data.film.length > 2) {
            ReadFile('service.php', 'result', data, 'search');
        }
    });

    $( "#genre" ).on( "change", function( event ) {
        //console.log( $( "#filterCinema" ).serialize() );
        ReadFile('service.php', 'result', filterData(), 'search');
    });

    $( "#timeStart" ).on( "change", function( event ) {
        console.log( $( "#filterCinema" ).serialize() );
        ReadFile('service.php', 'result', filterData(), 'search');
    });

    $( "#timeEnd" ).on( "change", function( event ) {
        //console.log( $( "#filterCinema" ).serialize() );
        ReadFile('service.php', 'result', filterData(), 'search');
    });

    function changePrice(event, ui){
        $( "#priceMin" ).val($(this).slider('values', 0));
        $( "#priceMax" ).val($(this).slider('values', 1) );
        //console.log( $( "#filterCinema" ).serialize() );
        ReadFile('service.php', 'result', filterData(), 'search');

    }

    $( "#filmsTable" ).on( "click", function(e) {
        const id = e.target.parentNode.attributes['data-movie-id'].value;
        myModal.setAttribute('data-movie-id', id);
        console.log(e.target.parentNode.attributes['data-movie-id'].value);

        ReadFile('service.php', 'result', getFilmId(), 'getFilm');
    });


} );


function ReadFile(filename, container, filterData, type) {
    //Создаем функцию обработчик

    const search = function(Request) {
        //document.getElementById(container).innerHTML = Request.responseText;

        const data = JSON.parse(Request.responseText);

        filmsTable.innerHTML = '';
        data.forEach(tr => {
            let tableRow = document.createElement("tr");
            for(let td in tr) {
                let tableData = document.createElement("td");
                if(td !== 'movie_id'){
                    tableData.innerHTML = tr[td];
                    tableRow.appendChild(tableData);
                }

            }
            tableRow.setAttribute('data-movie-id', tr['movie_id']);
            tableRow.value = tr['movie_id'];
            filmsTable.appendChild(tableRow);
            console.log(tr['movie_id']);

        });
    };
    const getFilm = function (Request) {
        const data = JSON.parse(Request.responseText);
       //----------------------
    }


    let Handler;
    switch(type){
        case 'search':
            Handler = search;
            break;
        case 'getFilm':
            Handler = getFilm;
            //
            break;
        default:
            //
    }

    //document.getElementById(container).innerHTML = '<img src="Loader.gif" width="100"/>';
    //Отправляем запрос
    console.log(filterData);
    var request = 'type=' +  type + '&' + 'data=' + JSON.stringify(filterData);
    console.warn(request);
    console.log(request);

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

