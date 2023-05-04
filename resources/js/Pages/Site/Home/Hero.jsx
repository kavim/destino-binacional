import LottiePlayer from '@/Components/LottiePlayer';
import { trans } from '@/utils';

export default function Hero() {
    return (
        <>
            <div className='flex flex-col md:flex-row justify-center items-center bg-white rounded-lg md:m-4'>
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
