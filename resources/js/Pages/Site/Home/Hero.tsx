import LottiePlayer from '@/Components/LottiePlayer';
import { trans } from '@/utils';

export default function Hero() {
    return (
        <>
            <div className="mx-0 mt-5 flex flex-col items-center justify-center rounded-xl border border-border bg-card shadow-sm dark:shadow-black/20 md:mx-4 md:flex-row">
                <div className='flex justify-between'>
                    <LottiePlayer></LottiePlayer>
                </div>
                <div className='break-words p-5'>
                    <h2 className='font-bold text-4xl mb-2'>
                        {trans('hero.title')}
                    </h2>
                    <p>
                        {trans('hero.body')}
                    </p>
                </div>
            </div>

        </>
    );
}
