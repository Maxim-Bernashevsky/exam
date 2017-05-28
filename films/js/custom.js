$( document ).ready(function() {



    ReadFile('service.php', 'result', filterData(), 'search');
});


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


    function getSeanceId(){
        //console.log('iddddd', $('#myModal').attr('data-seance-id'));
        return {
            id: $('#myModal').attr('data-seance-id')
        }
    }

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
        const id = e.target.parentNode.attributes['data-seance-id'].value;
        myModal.setAttribute('data-seance-id', id);
        console.log(e.target.parentNode.attributes['data-seance-id'].value);

        ReadFile('service.php', 'result', getSeanceId(), 'getSeance');
    });




