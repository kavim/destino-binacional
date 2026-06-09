<?php

namespace App\Console\Commands;

use App\Models\Event;
use App\Models\Place;
use App\Models\Tour;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class CheckPublicStorage extends Command
{
    protected $signature = 'storage:check-public';

    protected $description = 'Verifica symlink public/storage, permissões e registos órfãos (DB sem ficheiro)';

    public function handle(): int
    {
        $ok = true;

        $linkPath = public_path('storage');
        $targetPath = storage_path('app/public');

        if (! File::exists($linkPath)) {
            $this->error('Symlink em falta: public/storage');
            $this->line('Execute: php artisan storage:link --force');
            $ok = false;
        } elseif (! is_link($linkPath)) {
            $this->error('public/storage existe mas não é symlink (pode ser pasta estática desatualizada).');
            $ok = false;
        } else {
            $resolved = realpath($linkPath);
            $expected = realpath($targetPath);
            if ($resolved !== $expected) {
                $this->error("Symlink aponta para {$resolved}, esperado {$expected}");
                $ok = false;
            } else {
                $this->info('Symlink public/storage → storage/app/public OK');
            }
        }

        foreach (['events', 'places', 'tours', 'categories'] as $directory) {
            $relative = $directory;
            if (! Storage::disk('public')->exists($relative)) {
                Storage::disk('public')->makeDirectory($relative);
                $this->warn("Diretório criado: storage/app/public/{$relative}");
            }

            $fullPath = storage_path('app/public/'.$relative);
            if (! is_writable($fullPath)) {
                $this->error("Sem permissão de escrita: {$fullPath}");
                $ok = false;
            } else {
                $this->info("Escrita OK: storage/app/public/{$relative}");
            }
        }

        $orphans = $this->findOrphanRecords();
        if ($orphans === []) {
            $this->info('Nenhum registo órfão (featured_image sem ficheiro).');
        } else {
            $ok = false;
            $this->warn('Registos com featured_image mas ficheiro em falta:');
            foreach ($orphans as $line) {
                $this->line("  - {$line}");
            }
        }

        return $ok ? self::SUCCESS : self::FAILURE;
    }

    /**
     * @return list<string>
     */
    private function findOrphanRecords(): array
    {
        $lines = [];

        Event::query()
            ->whereNotNull('featured_image')
            ->where('featured_image', '!=', '')
            ->get(['id', 'featured_image'])
            ->each(function (Event $event) use (&$lines) {
                if (! Storage::disk('public')->exists('events/'.$event->featured_image)) {
                    $lines[] = "Event #{$event->id} events/{$event->featured_image}";
                }
            });

        Place::query()
            ->whereNotNull('featured_image')
            ->where('featured_image', '!=', '')
            ->get(['id', 'featured_image'])
            ->each(function (Place $place) use (&$lines) {
                if (! Storage::disk('public')->exists('places/'.$place->featured_image)) {
                    $lines[] = "Place #{$place->id} places/{$place->featured_image}";
                }
            });

        Tour::query()
            ->whereNotNull('featured_image')
            ->where('featured_image', '!=', '')
            ->get(['id', 'featured_image'])
            ->each(function (Tour $tour) use (&$lines) {
                if (! Storage::disk('public')->exists('tours/'.$tour->featured_image)) {
                    $lines[] = "Tour #{$tour->id} tours/{$tour->featured_image}";
                }
            });

        return $lines;
    }
}
