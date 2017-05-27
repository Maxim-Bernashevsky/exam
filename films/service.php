<?php
/**
 * Created by PhpStorm.
 * User: @chrstnv
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
        case 'getFilm':
            getFilm($data);
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
        $sql = 'SELECT 
            DATE_FORMAT(`seance`.`datetime`,"%d/%m/%Y") AS `seance_date`,
            `movies`.`name` AS `movie_name`,
            `genre`.`name` AS `genre_name`,
            TIME(`seance`.`datetime`) AS `seance_time`,
            `cinema`.`name` AS `cinema_name`,
            `hall`.`name` AS `hall_name`,
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
            trim($value);
            switch ($key) {
                case 'dateStart':
                    if($value != null) {
                        $dateStart = strtotime($value);
                        $dateStart = date('Y-m-d', $dateStart);
                    $sql .= 'DATE(`seance`.`datetime`) >= \''.$dateStart.'\' AND ' ;}
                    break;
                case 'dateEnd':
                    if($value != null) {
                        $dateEnd = strtotime($value);
                        $dateEnd = date('Y-m-d', $dateEnd);
                    $sql .= 'DATE(`seance`.`datetime`) <= \''.$dateEnd.'\' AND ' ;}
                    break;
                case 'film':
                    if($value != null) {$sql .= '`movies`.`name` COLLATE \'utf8_general_ci\' LIKE "%'.$value.'%" AND ';}
                    break;
                case 'genre':
                    if($value != 0) {$sql .= '`genre`.`id` = '.$value.' AND ';}
                    break;
                case 'timeStart':
                    if($value != null) {
                        $timeStart = strtotime($value);
                        $timeStart = date('H:i:s', $timeStart);
                        $timeEnd = strtotime($data['timeEnd']);
                        $timeEnd = date('H:i:s', $timeEnd);
                        //echo "timeEnd: ".$data['timeEnd'];
                        if($timeStart <= $timeEnd || $data['timeEnd'] == null) {
                            $sql .= 'TIME(`seance`.`datetime`) >=  \''.$timeStart. '\' AND ' ;}
                             elseif($data['timeEnd'] != null && $timeStart > $timeEnd)
                                {
                                    $sql .= '   (TIME(`seance`.`datetime`) >=  \''.$timeStart.'\' AND
                                                TIME(`seance`.`datetime`) <=  \'23:59:59\') OR
                                                (TIME(`seance`.`datetime`) >=  \'00:00:00\' AND
                                                TIME(`seance`.`datetime`) <=  \''.$timeEnd.'\') AND ';
                                }
                    }
                    break;
                case 'timeEnd':
                    if($value != null) {
                        $timeEnd = strtotime($value);
                        $timeEnd = date('H:i:s', $timeEnd);
                        $timeStart = strtotime($data['timeStart']);
                        $timeStart = date('H:i:s', $timeStart);
                        if ($timeStart <= $timeEnd || $data['timeStart'] == null) {
                            $sql .= 'TIME(`seance`.`datetime`) <=  \''.$timeEnd. '\' AND ' ;
                        }
                    }
                    break;
                case 'priceMin':
                    if($value != null) {$sql .= '`seance`.`price` >= '.$value.' AND ';}
                    break;
                case 'priceMax':
                    if($value != null) {$sql .= '`seance`.`price` <= '.$value.' AND ';}
                    break;
            }
        }
        unset ($value);
        $sql .= '1
        ORDER BY DATE(`seance`.`datetime`) ASC, TIME(`seance`.`datetime`) ASC, `movie_name` ASC;';
        $query = mysqli_query($db, $sql);
        if (mysqli_num_rows($query) > 0) {
            $searchResult = mysqli_fetch_all($query, MYSQLI_ASSOC);
            $response = json_encode($searchResult, JSON_UNESCAPED_UNICODE);
            echo $response;
            //echo $sql;
        } // else echo 'Данные не получены';
    } else echo 'Данные не получены';
}

function getFilm($data) {
    $db = connect();
    if($db){
        $data = json_decode($data, true);
        $id = $data['id'];
        $sql = 'SELECT 
                `movies`.`name` AS `movie_name`,
                `movies`.`desc` AS `desc`,
                CONCAT(`directed`.`first_name`,\' \', `last_name`)
                FROM `movies`
                LEFT JOIN `directed` ON `movies`.`id_directed` = `directed`.`ID`
                WHERE `movies`.`ID` = '.$id;
        $query = mysqli_query($db, $sql);
        if (mysqli_num_rows($query) > 0) {
            $searchResult = mysqli_fetch_all($query, MYSQLI_ASSOC);
            $response = json_encode($searchResult, JSON_UNESCAPED_UNICODE);
            echo $response;
        } // else echo 'Данные не получены';
    } else echo 'Данные не получены';

}