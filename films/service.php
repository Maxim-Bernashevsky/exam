<?php
/**
 * Created by PhpStorm.
 * User: Asus
 * Date: 26.05.2017
 * Time: 19:46
 */



if(isset ($_POST['type']) && isset($_POST['data'])) {
    $type = $_POST['type'];
    $data = $_POST['data'];
    switch ($type){
        case 'search':
            search($data);
            break;
        default:
            echo 'Not found';
            break;
    }
}

function connect() {
    $db = mysqli_connect('localhost', 'root', '', 'cinema');
    mysqli_set_charset($db, 'utf8');
    if (!mysqli_connect_errno()) {
        return $db;
    } else false;

}

function search($filter) {

    $db = connect();
    if ($db) {
        $data = json_decode($filter, true);
        //extract($data);
//    $dateStart = date_format($dateStart,'Y-m-d');
//    $dateEnd = date_format($dateEnd,'Y-m-d');
//    $timeStart = date_format($dateStart,'H:i:s');
//    $timeEnd = date_format($dateStart,'H:i:s');

// написать свитч
        
        $sql = 'SELECT 
            DATE(`seance`.`datetime`) AS `seance_date`,
            `movies`.`name` AS `movie_name`,
            `genre`.`name` AS `genre_name`,
            `hall`.`name`,
            `cinema`.`name`,
            TIME(`seance`.`datetime`) AS `seance_time`,
            `seance`.`price` AS `seance_price`
            FROM `seance` 
            LEFT JOIN `movies` 
            ON `seance`.`ID_movie` = `movies`.`id`
            LEFT JOIN `genre`
            ON `movies`.`ID_genre` = `genre`.`ID`
            LEFT JOIN `hall` ON `seance`.`ID_hall` = `hall`.`ID`
            LEFT JOIN `cinema` ON `hall`.`ID_cinema` = `cinema`.`ID`
        WHERE ';
        foreach ($data as $key => $value) {
            switch ($key) {
                case 'dateStart':
                    if($value !== null) $dateStart = date_format($value,'Y-m-d');
                    $sql .= 'DATE(`seance`.`datetime`) >= \''.$dateStart.' \' AND ' ;
                    break;
                case 'dateEnd':
                    if($value !== null) $dateEnd = date_format($value,'Y-m-d');
                    $sql .= 'DATE(`seance`.`datetime`) <= \''.$dateEnd. ' \' AND ' ;
                    break;
                case 'film':
                    if($value !== null) $sql .= '`movies`.`name` COLLATE \'utf8_general_ci\'  LIKE "%'.$value.'%" AND ';
                    break;
                case 'genre':
                    if($value !== null) $sql .= '`genre`.`id` = '.$value.' AND ';
                    break;
                case 'timeStart':
                    if($value !== null) $timeStart = date_format($value,'H:i:s');
                    $sql .= 'TIME(`seance`.`datetime`) >=  \''.$timeStart. ' \' AND ' ;
                    break;
                case 'timeEnd':
                    if($value !== null) $timeEnd = date_format($value,'Y-m-d');
                    $sql .= 'TIME(`seance`.`datetime`) <=  \''.$timeEnd. ' \' AND ' ;
                    break;
                case 'priceMin':
                    if($value !== null) $sql .= '`seance`.`price` >=  '.$value.' AND ' ;
                    break;
                case 'priceMax':
                    if($value !== null) $sql .= '`seance`.`price` <=  '.$value.' AND ' ;
                    break;
            }
        }
        $sql .= '1
        ORDER BY `movie_name`, DATE(`seance`.`datetime`) ASC, TIME(`seance`.`datetime`) ASC';
        /*
        $str = 'DATE(`seance`.`datetime`) >= '.$dateStart.' AND
        DATE(`seance`.`datetime`) <= '.$dateEnd.' AND
        `movies`.`name` COLLATE \'utf8_general_ci\'  LIKE "%'.$film.'%" AND

        `genre`.`id` = '.$genre.' AND
        TIME(`seance`.`datetime`) BETWEEN '.$timeStart.' AND '.$timeEnd.' AND
        `seance`.`price` >=  '.$priceMin.' AND
        `seance`.`price` <= '.$priceMax.',
        1
        ORDER BY DATE(`seance`.`datetime`) ASC, TIME(`seance`.`datetime`) ASC'; */

//        $query = mysqli_query($db, $sql);
//        $searchResult = mysqli_fetch_all($query, MYSQLI_ASSOC);
//        $response = json_encode($searchResult, JSON_UNESCAPED_UNICODE);
//        echo $response;
        echo $sql;
    } else echo 'хуй вам, а не табличка';

}