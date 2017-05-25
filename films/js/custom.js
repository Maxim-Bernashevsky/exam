
$( function() {
    /* RU datepicker */
    $.datepicker.regional['ru'] = {
        monthNames: ['Яварь', 'Февраль', 'Март', 'Апрель',
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
        console.log( JSON.stringify($( "#filterCinema" ).serializeArray()) );
        ReadFile('films.php', 'result', 0);
    });

    $( "#dateEnd" ).on( "change", function( event ) {
        console.log( $( "#filterCinema" ).serialize() );
    });

    $( "#film" ).on( "keyup", function( event ) {
        console.log( JSON.stringify($( "#filterCinema" ).serializeArray()) );
    });

    $( "#genre" ).on( "change", function( event ) {
        console.log( $( "#filterCinema" ).serialize() );
    });

    $( "#timeStart" ).on( "change", function( event ) {
        console.log( $( "#filterCinema" ).serialize() );
    });

    $( "#timeEnd" ).on( "change", function( event ) {
        console.log( $( "#filterCinema" ).serialize() );
    });

    function changePrice(event, ui){
        $( "#priceMin" ).val($(this).slider('values', 0));
        $( "#priceMax" ).val($(this).slider('values', 1) );
        console.log( $( "#filterCinema" ).serialize() );

    }
} );







function ReadFile(filename, container, filterData) {
    //Создаем функцию обработчик
    var Handler = function(Request) {
        document.getElementById(container).innerHTML = Request.responseText;
    }
    //document.getElementById(container).innerHTML = '<img src="Loader.gif" width="100"/>';
    //Отправляем запрос
    SendRequest("POST", filename, filterData, Handler);
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

