import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { trans } from '@/utils';
import { EventCard } from '@/Components/EventCard';

type HomeEventItem = {
    slug: string;
    image: string;
    title: string;
    start: string;
    end: string;
};

type GroupedEventsMap = Record<string, HomeEventItem[]>;

export default function Events() {
    dayjs.locale("es");
    const { grouped_events } = usePage().props as unknown as { grouped_events: GroupedEventsMap };

    const [slectedDate, setSlectedDate] = useState<string | null>(null);

    const slideToStart = () => {
        const slider = document.getElementById('slider');
        if (!slider) return;
        slider.scrollLeft = 10;
    };

    const goToDate = (group: string) => {
        setSlectedDate(group);
        slideToStart();
    }

    return (
        <div className="rounded-xl border border-border bg-card/95 py-4 shadow-md shadow-black/[0.06] dark:bg-card dark:shadow-black/25 sm:py-3 md:mx-4 md:p-2">
            <div className="w-full px-3 text-center sm:px-4">
                <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">
                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        Próximos eventos
                    </span>
                </h2>
            </div>
            {Object.keys(grouped_events).length > 0 ? (
                <>
                    <div className="scrollbar-hide flex max-w-full flex-nowrap scroll-smooth gap-1 overflow-x-auto overscroll-x-contain px-2 pb-2 pt-5 [-webkit-overflow-scrolling:touch]">
                        {Object.keys(grouped_events).map((group, index) => {
                            return (
                                <div
                                    key={group}
                                    data-slide-index={index}
                                    onClick={() => goToDate(group)}
                                    className="m-2 shrink-0 snap-start"
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            goToDate(group);
                                        }
                                    }}
                                >
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

                    <div
                        id="slider"
                        className="scrollbar-hide flex w-full snap-x snap-mandatory flex-row flex-nowrap items-start justify-start gap-0 overflow-x-auto scroll-smooth overscroll-x-contain px-3 pb-5 pt-4 sm:px-2 sm:pb-5 sm:pt-3 [-webkit-overflow-scrolling:touch]"
                    >
                        {slectedDate ? (
                            <>
                                {
                                    grouped_events[slectedDate].map((event) => (
                                        <EventCard key={event.slug} event={event} />
                                    ))
                                }
                            </>
                        ) : (
                            <>
                                {
                                    Object.keys(grouped_events).map((group) =>
                                        grouped_events[group].map((event) => (
                                            <EventCard
                                                key={`${group}-${event.slug}`}
                                                event={event}
                                            />
                                        )),
                                    )
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
