<?php

include 'dbconnection.php';

header('Content-Type: application/json');

$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod === 'GET') {
    // Ensure program ID is retrieved securely from GET request
    $programId = isset($_GET['program_id']) ? (int) $_GET['program_id'] : null;

    // Validate program ID (optional)
    if (!$programId) {
        echo json_encode(['status' => 'Error', 'message' => 'Missing program ID']);
        exit;
    }

    // Prepare SQL statement with parameterized query (prevents SQL injection)
    $data = "SELECT name, date_time, program_details, participant_limit, total_participant, location, status FROM program WHERE id = ?";
    $stmt = $db->prepare($data);
    $stmt->bind_param('i', $programId);

    // Execute the prepared statement
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $programs = [];
        while ($row = $result->fetch_assoc()) {
            $programs[] = $row;
        }
        echo json_encode(['status' => 'Success', 'programs' => $programs]);
    } else {
        echo json_encode(['status' => 'Error', 'message' => 'Program not found']);
    }
} elseif ($requestMethod === 'POST') {
    // Read the JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    // Log the input to see what's being received
    error_log(print_r($input, true));

    // Ensure program ID is retrieved securely from GET request
    $programId = isset($_GET['program_id']) ? (int) $_GET['program_id'] : null;

    // Validate program ID (optional)
    if (!$programId) {
        echo json_encode(['status' => 'Error', 'message' => 'Missing program ID']);
        exit;
    }

    // Initialize array to store update fields and values
    $updateFields = [];

    // Check if each field is present in the input and add it to the updateFields array
    if (isset($input['name'])) {
        $updateFields[] = "name = ?";
    }

    if (isset($input['date_time'])) {
        $updateFields[] = "date_time = ?";
    }

    if (isset($input['location'])) {
        $updateFields[] = "location = ?";
    }

    if (isset($input['participant_limit'])) {
        $updateFields[] = "participant_limit = ?";
    }

    if (isset($input['program_details'])) {
        $updateFields[] = "program_details = ?";
    }

    // Log the updateFields to see what fields are being prepared for update
    error_log(print_r($updateFields, true));

    // Construct the UPDATE query
    if (!empty($updateFields)) {
        $updateQuery = "UPDATE program SET " . implode(', ', $updateFields) . " WHERE id = ?";
        $stmt = $db->prepare($updateQuery);
        
        // Dynamically bind parameters
        $types = '';
        $params = [];
        foreach ($updateFields as $field) {
            $key = trim(explode('=', $field)[0]);
            $types .= 's';
            $params[] = $input[$key];
        }
        $types .= 'i';
        $params[] = $programId;
        $stmt->bind_param($types, ...$params);

        // Execute the query
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(['status' => 'Success', 'message' => 'Program updated successfully']);
            } else {
                echo json_encode(['status' => 'Error', 'message' => 'No changes made or program not found']);
            }
        } else {
            echo json_encode(['status' => 'Error', 'message' => 'Failed to update program: ' . $db->error]);
        }
    } else {
        echo json_encode(['status' => 'Error', 'message' => 'No fields provided for update']);
    }
} elseif ($requestMethod === 'DELETE') {
    // Parse the query string to get the program ID
    parse_str(file_get_contents("php://input"), $queryParams);
      $programId = isset($_GET['program_id']) ? (int) $_GET['program_id'] : null;

    // Validate program ID (optional)
    if (!$programId) {
        echo json_encode(['status' => 'Error', 'message' => 'Missing program ID']);
        exit;
    }

    // Prepare SQL statement with parameterized query (prevents SQL injection)
    $query = "DELETE FROM program WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param('i', $programId);

    // Execute the prepared statement
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['status' => 'Success', 'message' => 'Program deleted successfully']);
        } else {
            echo json_encode(['status' => 'Error', 'message' => 'Program not found or already deleted']);
        }
    } else {
        echo json_encode(['status' => 'Error', 'message' => 'Failed to delete program: ' . $db->error]);
    }
} else {
    echo json_encode(['status' => 'Error', 'message' => 'Invalid request method']);
}
?>
