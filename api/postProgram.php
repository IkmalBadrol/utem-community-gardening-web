<?php

include 'dbconnection.php';

$input = json_decode(file_get_contents('php://input'),true);

if(!isset(
    $input['name'],
    $input['date_time'],
    $input['participant_limit'],
    $input['total_participant'],
    $input['location'],
    $input['status']
)){
    echo json_encode(['status'=>'error', 'message'=>'invalid input']);
}

$name = $input['name'];
$dateTime = new DateTime($input['date_time']);
$participantLimit = $input['participant_limit'];
$totalParticipant = $input['total_participant'];
$location = $input['location'];
$status = $input['status'];

// Format the DateTime object as a string
$dateTimeFormatted = $dateTime->format('Y-m-d H:i:s');

$registerProgram = "INSERT INTO program(name, date_time, participant_limit, total_participant, location, status) VALUES (?,?,?,?,?,?)";

$stmt = $db->prepare($registerProgram);
$stmt->bind_param('ssiiss', $name, $dateTimeFormatted, $participantLimit, $totalParticipant, $location, $status);

$response =array(
    "name"=> $name,
    "date_time"=>$dateTimeFormatted,
    "participant_limit" => $participantLimit,
    "total_participant" => $totalParticipant,
    "location" => $location,
    "status" => $status
);

if($stmt->execute()){
    echo json_encode($response);
}else{
    echo json_encode(['status'=>'error', 'message'=>'Failed to post program']);
}

?>