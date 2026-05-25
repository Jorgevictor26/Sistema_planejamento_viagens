<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'trip_id' => $this->trip_id,
            'category' => $this->category,
            'amount' => $this->amount,
            'description' => $this->description,
            'expense_date' => $this->expense_date?->toDateString(),
            'trip' => $this->whenLoaded('trip', fn () => [
                'id' => $this->trip->id,
                'destination_city' => $this->trip->destination_city,
                'destination_country' => $this->trip->destination_country,
            ]),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
