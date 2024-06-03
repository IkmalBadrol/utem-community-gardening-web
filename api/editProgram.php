<?php

include 'dbconnection.php';

// Set headers to handle JSON input and output
header('Content-Type: application/json');

// Read the JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Check if the input is valid
if (!isset($input['program_id'])) {
    echo json_encode(['status' => 'Error', 'message' => 'Invalid input']);
    exit();
}

// Retrieve form data from the input
$programId = $input['program_id'];
$updateFields = [];

if (isset(
    $input['name'])) {
    $name = $input['name'];
    $updateFields[] = "name = '$name'";
}

if (isset($input['date_time'])) {
    $dateTime = new DateTime($input['date_time']);
    $dateTimeFormatted = $dateTime->format('Y-m-d H:i:s');
    $updateFields[] = "date_time = '$dateTimeFormatted'";
}

if (isset($input['location'])) {
    $location = $input['location'];
    $updateFields[] = "location = '$location'";
}

if (isset($input['participant_limit'])) {
    $participantLimit = $input['participant_limit'];
    $updateFields[] = "participant_limit = '$participantLimit'";
}

// Prepare the update query
$updateQuery = "UPDATE program SET " . implode(', ', $updateFields) . " WHERE id = $programId";

// Execute the query
if ($db->query($updateQuery)) {
    if ($db->affected_rows > 0) {
        echo json_encode(['status' => 'Success', 'message' => 'Program updated successfully']);
    } else {
        echo json_encode(['status' => 'Error', 'message' => 'No changes made or program not found']);
    }
} else {
    echo json_encode(['status' => 'Error', 'message' => 'Failed to update program']);
}

?>
