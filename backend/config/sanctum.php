<?php

return [
    // Token-only authentication (Bearer). No cookie/SPA stateful domains.
    'stateful' => [],
    'guard' => [],
    'expiration' => (int) env('SANCTUM_EXPIRATION', 1440),
    'token_prefix' => '',
    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
        'validate_csrf_token' => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    ],
];
