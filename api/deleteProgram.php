<?php

include 'dbconnection.php';

// Set headers to handle JSON input and output
header('Content-Type: application/json');

// Read the JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Check if the input is valid
if (!isset($input['id'])) {
    echo json_encode(['status' => 'Error', 'message' => 'Invalid input']);
    exit();
}

// Retrieve program ID from the input
$programId = $input['id'];

// Prepare the delete query
$deleteProgram = "DELETE FROM program WHERE id = ?";

$stmt = $db->prepare($deleteProgram);
$stmt->bind_param('i', $programId);

// Execute the query
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'Success', 'message' => 'Program deleted successfully']);
    } else {
        echo json_encode(['status' => 'Error', 'message' => 'Program not found']);
    }
} else {
    echo json_encode(['status' => 'Error', 'message' => 'Failed to delete program']);
}

?>
