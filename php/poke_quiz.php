<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$DB_HOST = 'localhost';
$DB_USER = 'liadka2_idoba2';
$DB_PASS = 'VitalyIdoLiad';
$DB_NAME = 'liadka2_final_web_project';

function sendJsonResponse($statusCode, $payload)
{
    http_response_code($statusCode);
    echo json_encode($payload);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(405, ['success' => false, 'message' => 'Method Not Allowed']);
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = preg_replace('/\D/', '', $_POST['phone'] ?? '');
$age = (int) ($_POST['age'] ?? 0);
$pokemon_years = trim($_POST['pokemon_years'] ?? '');
$consent = isset($_POST['consent']) ? 1 : 0;

$lettersOnlyName = preg_replace('/[^A-Za-z]/', '', $name);
$isNameValid = strlen($lettersOnlyName) >= 2;
$isEmailValid = filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
$isPhoneValid = preg_match('/^0\d{8,9}$/', $phone) === 1;
$isAgeValid = $age >= 10 && $age <= 120;
$isPokemonYearsValid = $pokemon_years !== '';

if (!$isNameValid || !$isEmailValid || !$isPhoneValid || !$isAgeValid || !$isPokemonYearsValid || !$consent) {
  sendJsonResponse(400, ['success' => false, 'message' => 'Invalid quiz submission data']);
}

$correctAnswers = [
    'q1' => 'B',
    'q2' => 'C',
    'q3' => 'B',
    'q4' => 'A',
    'q5' => 'D'
];

$score = 0;
foreach ($correctAnswers as $question => $correctAnswer) {
    $givenAnswer = $_POST[$question] ?? '';
    if ($givenAnswer === $correctAnswer) {
        $score++;
    }
}

$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
if ($conn->connect_error) {
  sendJsonResponse(500, ['success' => false, 'message' => 'Database connection failed']);
}

$sql = "INSERT INTO quiz_results (name, email, phone, age, pokemon_years, quiz_score, consent, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    $conn->close();
  sendJsonResponse(500, ['success' => false, 'message' => 'Could not prepare result for saving']);
}

$stmt->bind_param('sssisii', $name, $email, $phone, $age, $pokemon_years, $score, $consent);
$isSaved = $stmt->execute();

$stmt->close();
$conn->close();

if (!$isSaved) {
  sendJsonResponse(500, ['success' => false, 'message' => 'Could not save quiz result']);
}

sendJsonResponse(200, ['success' => true, 'score' => $score]);
?>