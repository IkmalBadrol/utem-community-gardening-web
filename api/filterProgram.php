<?php

include 'dbconnection.php';

// Set headers to handle JSON input and output
header('Content-Type: application/json');

// Read the JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Check if the input is valid
if (!isset($input['location']) && !isset($input['date_time'])) {
    echo json_encode(['status' => 'Error', 'message' => 'Invalid input']);
    exit();
}

// Retrieve filters from the input
$location = isset($input['location']) ? $input['location'] : null;
$dateTime = isset($input['date_time']) ? new DateTime($input['date_time']) : null;
$dateTimeFormatted = $dateTime ? $dateTime->format('Y-m-d') : null; // Assuming you want to match by date only, without time

// Prepare the base query
$filterQuery = "SELECT name, date_time, participant_limit, total_participant, location, status FROM program WHERE 1=1";

// Add location filter if provided
if ($location) {
    $filterQuery .= " AND location = ?";
}

// Add date_time filter if provided
if ($dateTimeFormatted) {
    $filterQuery .= " AND DATE(date_time) = ?"; // Ensure the query checks the date part only
}

$stmt = $db->prepare($filterQuery);

// Bind parameters based on the provided filters
if ($location && $dateTimeFormatted) {
    $stmt->bind_param('ss', $location, $dateTimeFormatted);
} elseif ($location) {
    $stmt->bind_param('s', $location);
} elseif ($dateTimeFormatted) {
    $stmt->bind_param('s', $dateTimeFormatted);
}

// Execute the query
$stmt->execute();
$result = $stmt->get_result();

// Check if any programs were found
if ($result->num_rows > 0) {
    $programs = array();
    while ($row = $result->fetch_assoc()) {
        $programs[] = $row;
    }
    echo json_encode(['status' => 'Success', 'programs' => $programs]);
} else {
    echo json_encode(['status' => 'Error', 'message' => 'No programs found for the specified filters']);
}

?>
