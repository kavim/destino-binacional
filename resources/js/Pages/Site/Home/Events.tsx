import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { es } from 'dayjs/locale/es';
import { trans } from '@/utils';
import { EventCard } from '@/Components/EventCard';

export default function Events() {
    dayjs.locale("es");
    const { grouped_events } = usePage().props;

    const [slectedDate, setSlectedDate] = useState(null);

    const slideToStart = () => {
        const slider = document.getElementById('slider');
        slider.scrollLeft = 10;
    }

    const goToDate = (group) => {
        setSlectedDate(group);
        slideToStart();
    }

    return (
        <div className="rounded-xl border border-border bg-card/95 py-3 shadow-md shadow-black/[0.06] dark:bg-card dark:shadow-black/25 md:mx-4 md:p-2 sm:p-0">
            <div className="text-3xl md:text-4xl font-extrabold text-center">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Próximos eventos
                </span>
            </div>
            {Object.keys(grouped_events).length > 0 ? (
                <>
                    <div className='flex max-w-full overflow-x-auto scroll whitespace-nowrap scroll-smooth scrollbar-hide py-5 px-2'>
                        {Object.keys(grouped_events).map((group, index) => {
                            return (
                                <div
                                    key={index}
                                    label={index}
                                    onClick={() => goToDate(group)}
                                    className="m-2">
                                    <div className="flex w-32 flex-none cursor-pointer rounded-xl border border-border bg-card text-center shadow-sm active:opacity-90 md:w-24">
                                        <div className="flex w-full flex-col overflow-hidden text-center">
                                            <div className="rounded-t-xl bg-primary py-1 text-sm font-medium uppercase tracking-wide text-primary-foreground">
                                                {dayjs(group).format('MMM')}
                                            </div>
                                            <div className="pt-1 border-l border-r border-border bg-card">
                                                <span className="text-5xl md:text-3xl font-bold leading-tight">
                                                    {dayjs(group).format('DD')}
                                                </span>
                                            </div>
                                            <div className="mb-1 rounded-b-xl border-x border-b border-border bg-card pb-1 pt-0 text-center text-muted-foreground">
                                                <span className="text-sm">
                                                    {dayjs(group).format('dddd')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div id='slider' className='w-full h-full overflow-x-auto scroll whitespace-nowrap scroll-smooth scrollbar-hide px-2 py-5 flex flex-row'>
                        {slectedDate ? (
                            <>
                                {
                                    grouped_events[slectedDate].map((event, index) => (
                                        <EventCard key={index} index={index} event={event} />
                                    ))
                                }
                            </>
                        ) : (
                            <>
                                {
                                    Object.keys(grouped_events).map((group, index) => {
                                        return (
                                            grouped_events[group].map((event, index) => (
                                                <EventCard key={index} index={index} event={event} />
                                            ))
                                        )
                                    })
                                }
                            </>
                        )}
                    </div>

                    <div className='w-full flex justify-center my-5'>
                        <Link href={route('site.events.index')} className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                            {trans('see_more')} Eventos <i className="fa-solid fa-arrow-right ml-2"></i>
                        </Link>
                    </div>
                </>
            ) : (
                <div className='flex justify-center w-full text-center'>
                    <span>No hay eventos registrados</span>
                </div>
            )}

        </div >
    );
}
