<?php

include 'dbconnection.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

// Retrieve filters from the input
$user_id = isset($input['user_id']) ? $input['user_id'] : null;
$status = isset($input['status']) ? $input['status'] : 'Open';

// Prepare the base query
$data = "
    SELECT 
        p.name AS program_name,
        p.date_time,
        p.participant_limit,
        p.total_participant,
        p.location,
        p.status AS program_status,
        ua.user_id,
        ua.status 
    FROM 
        program p
    LEFT JOIN 
        user_activity ua ON p.id = ua.program_id
    WHERE 
        ua.status = ?
";

// Append filters based on provided input
$conditions = [];
$params = [$status];
$types = 's';

if ($user_id !== null) {
    $conditions[] = "ua.user_id = ?";
    $params[] = $user_id;
    $types .= 'i';
}

if (!empty($conditions)) {
    $data .= " AND " . implode(" AND ", $conditions);
}

// Prepare and execute the query
$stmt = $db->prepare($data);

// Bind the parameters dynamically
$stmt->bind_param($types, ...$params);

$stmt->execute();
$result = $stmt->get_result();

// Check if any programs were found
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
