$headers = @{
    "Content-Type" = "application/json"
}
$body = @{
    "title" = "Pizza Margherita"
    "description" = "Pizza clásica italiana"
    "ingredients" = @(
        @{
            "name" = "harina"
            "quantity" = "500g"
        },
        @{
            "name" = "agua"
            "quantity" = "300ml"
        }
    )
    "portions" = 4
} | ConvertTo-Json

Invoke-WebRequest -Method Post -Uri http://localhost:5000/recipes -Headers $headers -Body $body
