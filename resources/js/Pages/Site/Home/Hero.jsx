import LottiePlayer from '@/Components/LottiePlayer';
import { trans } from '@/utils';

export default function Hero() {
    return (
        <>
            <div className='flex flex-col md:flex-row justify-center items-center bg-white rounded-lg my-5 p-5'>
                <div>
                    <LottiePlayer></LottiePlayer>
                </div>
                <div className='break-words'>
                    <h2 className='font-bold text-3xl mb-2'>
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
