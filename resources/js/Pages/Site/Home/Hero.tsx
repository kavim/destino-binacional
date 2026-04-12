import LottiePlayer from '@/Components/LottiePlayer';
import { trans } from '@/utils';

export default function Hero() {
    return (
        <>
            <div className="mx-0 mt-5 flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm dark:shadow-black/20 sm:p-6 md:mx-4 md:flex-row md:p-5">
                <div className="flex w-full shrink-0 justify-center md:w-auto md:max-w-[45%]">
                    <LottiePlayer />
                </div>
                <div className="w-full min-w-0 break-words md:flex-1">
                    <h2 className="mb-2 text-2xl font-bold sm:text-3xl md:text-4xl">
                        {trans('hero.title')}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {trans('hero.body')}
                    </p>
                </div>
            </div>

        </>
    );
}
