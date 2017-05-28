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
    hallTable.setAttribute('data-id-seance', seanceId);

    const hall = {
        id_seance: seanceId
    };

    ReadFile('service.php', 'result', hall, 'getHall');
});


    let stateOrder = [];


    $( "#hallTable" ).on( "click", function(e) {
        const seanceId = $('#hallTable').attr('data-id-seance');
        const status = e.target.attributes['data-status'].value;
        const row = e.target.parentNode.attributes['data-row'].value;
        const place = e.target.innerHTML;

        const order = {
            row: row,
            number: place,
            status: status
        };
        const checkStateOrder = function (row, place){
            if(stateOrder.length > 0){
                for(let i = 0; i < stateOrder.length; i++){
                    if(stateOrder[i].row === row && stateOrder[i].number === place){
                        stateOrder.splice(i, 1);
                    }
                }
            }
        };

        order.status === '0' ? stateOrder.push(order) : checkStateOrder(row, place);

        order.status = order.status === '0' ? '1' : '0';
        e.target.setAttribute('data-status', order.status);

        const orderUpdate = {
            id_seance: seanceId,
            order: [order]
        };

        console.log('toUpdate',orderUpdate);
        //lastUpdate = order;
        ReadFile('service.php', 'result', orderUpdate, 'updateOrder');
        showOrder();
    });

    $( "#getOrder" ).on( "click", function(e) {
        console.log(stateOrder);
        let updateList = [];
        stateOrder.forEach(el => {
            el.status = 2;
            updateList.push(el);
        });


        const request = {
            id_seance: seanceId,
                order: updateList
        };
        console.log(request);
        ReadFile('service.php', 'result', request, 'updateOrder');

    });


    function showOrder(){

        let text = stateOrder.length ? 'Ваш заказ: ' : '';

        stateOrder.forEach(el => {
            text += el.number + 'место ('+ el.row + 'ряд), ';
        });
        text = text.substring(0,text.length-2);
        text = text ? text + '.' : '';
        stateOrderBlock.innerHTML = text ;
    }


