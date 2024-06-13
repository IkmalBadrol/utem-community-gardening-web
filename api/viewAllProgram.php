<?php

include 'dbconnection.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['user_id'])) {
    echo json_encode(['status' => 'Error', 'message' => 'User ID is required']);
    exit();
}

$userId = $input['user_id'];
$searchQuery = isset($input['search_query']) ? '%' . $input['search_query'] . '%' : '%';

$data = "
    SELECT 
        p.id,
        p.program_details,
        p.name,
        p.date_time,
        p.participant_limit,
        p.total_participant,
        p.location,
        p.status,
        COALESCE(ua.user_id, 0) AS is_registered
    FROM 
        program p
    LEFT JOIN 
        user_activity ua 
    ON 
        p.id = ua.program_id AND ua.user_id = ?
    WHERE 
        p.name LIKE ? OR p.location LIKE ? OR p.program_details LIKE ?
";

$stmt = $db->prepare($data);
$stmt->bind_param('isss', $userId, $searchQuery, $searchQuery, $searchQuery);
$stmt->execute();
$result = $stmt->get_result();

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
