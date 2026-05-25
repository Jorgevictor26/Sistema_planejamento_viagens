<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'trip_id',
    'category',
    'amount',
    'description',
    'expense_date',
])]
class Expense extends Model
{
    use HasFactory;

    public const CATEGORIES = [
        'hotel',
        'transporte',
        'alimentacao',
        'alimentação',
        'compras',
        'passeio',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'expense_date' => 'date',
        ];
    }

    public function trip(): BelongsTo
    {
        return $this->belongsTo(Trip::class);
    }
}
