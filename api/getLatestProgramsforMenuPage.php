<?php

include 'dbconnection.php';

header('Content-Type: application/json');

$data = "SELECT name, program_details, date_time, participant_limit, total_participant, location, status FROM program ORDER BY date_time DESC LIMIT 2";

$stmt = $db->prepare($data);

if (!$stmt) {
    echo json_encode(['status' => 'Error', 'message' => 'Database error: ' . $db->error]);
    exit();
}

$stmt->execute();
$result = $stmt->get_result();

if (!$result) {
    echo json_encode(['status' => 'Error', 'message' => 'Query execution failed']);
    exit();
}

if ($result->num_rows > 0) {
    $programs = [];
    while ($row = $result->fetch_assoc()) {
        $programs[] = $row;
    }
    echo json_encode(['status' => 'Success', 'programs' => $programs]);
} else {
    echo json_encode(['status' => 'Error', 'message' => 'No programs found']);
}

?>
