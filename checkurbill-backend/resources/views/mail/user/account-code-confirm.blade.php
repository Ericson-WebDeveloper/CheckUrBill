<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Confirm Account</title>
</head>
<body>
    <h1>Hi {{ $data->firstname . ' ' . $data->lastname }}  </h1>
    <p>this is code to confirm account link. {{ $data->code }}. will expires 5 minutes.</p>
</body>
</html>