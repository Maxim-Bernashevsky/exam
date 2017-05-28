$( document ).ready(function() {


    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    const seanceId = getParameterByName('seance_id');
    console.log(seanceId);
    hallTable.setAttribute('data-id-seance', seanceId);

    const hall = {
        id_seance: seanceId
    };

    ReadFile('service.php', 'result', hall, 'getHall');
});

stateOrder = [];

$( "#hallTable" ).on( "click", function(e) {
    const seanceId = $('#hallTable').attr('data-id-seance');
    const status = e.target.attributes['data-status'].value === '0' ? '1' : '0';
    const row = e.target.parentNode.attributes['data-row'].value;
    const place = e.target.innerHTML;

    const order = {
        row: row,
        number: place,
        status: status
    };
    const removePlace = function (row, place){
        if(stateOrder.length){
            stateOrder.foreach((el, i) => {
                console.log(el, i);
                if(el.row === row && el.place === place){
                    stateOrder[i].status = 0;
                    stateOrder.push(order);
                    //stateOrder.splice(i, 1);
                }
            })
        } else {
            stateOrder.push(order);
        }
        console.log('remove');
    };
    console.log(status === '0');
    status == '1' ? stateOrder.push(order) : removePlace(row, place);
    console.log(stateOrder);

    const orderUpdate = {
        id_seance: seanceId,
        order: stateOrder
    };
    showOrder();
    ReadFile('service.php', 'result', orderUpdate, 'updateOrder');
});


function showOrder(){

    let text = 'Ваш заказ: ';

    stateOrder.forEach(el=>{
        //console.log(el, rows);
        text += el.number + 'место ('+ el.row + 'ряд),';
    });



    stateOrderBlock.innerHTML = text;


}