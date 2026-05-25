<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Trip;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ExportController extends Controller
{
    public function tripsCsv(): Response
    {
        Log::info('export.trips.csv', ['user_id' => Auth::id()]);

        return $this->csv('trips.csv', [
            ['Destino', 'Pais', 'Inicio', 'Fim', 'Orcamento'],
            ...Trip::query()
                ->where('user_id', Auth::id())
                ->orderByDesc('created_at')
                ->get()
                ->map(fn (Trip $trip) => [
                    $trip->destination_city,
                    $trip->destination_country,
                    $trip->start_date?->toDateString(),
                    $trip->end_date?->toDateString(),
                    $trip->budget,
                ])
                ->all(),
        ]);
    }

    public function expensesCsv(): Response
    {
        Log::info('export.expenses.csv', ['user_id' => Auth::id()]);

        return $this->csv('expenses.csv', [
            ['Viagem', 'Categoria', 'Valor', 'Data', 'Descricao'],
            ...$this->expenseQuery()
                ->with('trip')
                ->orderByDesc('expense_date')
                ->get()
                ->map(fn (Expense $expense) => [
                    $expense->trip->destination_city,
                    $expense->category,
                    $expense->amount,
                    $expense->expense_date?->toDateString(),
                    $expense->description,
                ])
                ->all(),
        ]);
    }

    public function tripsPdf(): Response
    {
        Log::info('export.trips.pdf', ['user_id' => Auth::id()]);

        $lines = Trip::query()
            ->where('user_id', Auth::id())
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Trip $trip) => "{$trip->destination_city}, {$trip->destination_country} - {$trip->budget}")
            ->all();

        return $this->pdf('trips.pdf', 'Viagens', $lines);
    }

    public function expensesPdf(): Response
    {
        Log::info('export.expenses.pdf', ['user_id' => Auth::id()]);

        $lines = $this->expenseQuery()
            ->with('trip')
            ->orderByDesc('expense_date')
            ->get()
            ->map(fn (Expense $expense) => "{$expense->trip->destination_city} - {$expense->category}: {$expense->amount}")
            ->all();

        return $this->pdf('expenses.pdf', 'Despesas', $lines);
    }

    private function expenseQuery()
    {
        return Expense::query()
            ->whereHas('trip', fn ($query) => $query->where('user_id', Auth::id()));
    }

    private function csv(string $filename, array $rows): Response
    {
        $content = collect($rows)
            ->map(fn (array $row) => collect($row)->map(fn ($value) => '"'.str_replace('"', '""', (string) $value).'"')->implode(','))
            ->implode("\n");

        return response($content, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    private function pdf(string $filename, string $title, array $lines): Response
    {
        $text = $title."\n\n".implode("\n", $lines ?: ['Sem dados para exportar.']);
        $stream = 'BT /F1 12 Tf 50 780 Td '.collect(explode("\n", $text))
            ->map(fn (string $line, int $index) => ($index ? '0 -18 Td ' : '').'('.$this->escapePdf($line).') Tj')
            ->implode(' ').' ET';
        $objects = [
            '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
            '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
            '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj',
            '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
            '5 0 obj << /Length '.strlen($stream)." >> stream\n{$stream}\nendstream endobj",
        ];

        $pdf = "%PDF-1.4\n";
        $offsets = [0];

        foreach ($objects as $object) {
            $offsets[] = strlen($pdf);
            $pdf .= $object."\n";
        }

        $xref = strlen($pdf);
        $pdf .= "xref\n0 ".count($offsets)."\n0000000000 65535 f \n";

        foreach (array_slice($offsets, 1) as $offset) {
            $pdf .= str_pad((string) $offset, 10, '0', STR_PAD_LEFT)." 00000 n \n";
        }

        $pdf .= 'trailer << /Size '.count($offsets)." /Root 1 0 R >>\nstartxref\n{$xref}\n%%EOF";

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    private function escapePdf(string $value): string
    {
        return str_replace(['\\', '(', ')'], ['\\\\', '\(', '\)'], $value);
    }
}
